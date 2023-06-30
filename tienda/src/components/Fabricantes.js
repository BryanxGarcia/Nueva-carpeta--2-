import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import './fabricante.css'; // Estilos CSS del Sidebar
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';

export const Fabricantes = () => {
  const [fabricantes, setFabricantes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [fabricanteSeleccionado, setFabricanteSeleccionado] = useState({});

  // Función para obtener los fabricantes desde la API
  const obtenerFabricantes = async () => {
    try {
      const response = await fetch("http://localhost:3001/fabricantes");
      if (response.ok) {
        const data = await response.json();
        setFabricantes(data);
      } else {
        console.error("Error al obtener los fabricantes");
      }
    } catch (error) {
      console.error("Error al comunicarse con la API", error);
    }
  };

  // Llamada a obtenerFabricantes cuando el componente se monta
  useEffect(() => {
    obtenerFabricantes();
  }, []);

  const handleAgregarFabricante = async () => {
    try {
      // Envía una solicitud POST a la API para agregar un nuevo fabricante
      const response = await fetch("http://localhost:3001/fabricantes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fabricanteSeleccionado),
      });

      if (response.ok) {
        setShowModalAdd(false);
        obtenerFabricantes();
        // Si la solicitud fue exitosa, actualiza el estado de los fabricantes
        setFabricantes([...fabricantes, fabricanteSeleccionado]);
        setFabricanteSeleccionado({});
      } else {
        // Maneja el caso en que la solicitud no sea exitosa
        console.error("Error al agregar el fabricante");
      }
    } catch (error) {
      console.error("Error al comunicarse con la API", error);
    }
  };

  const handleEliminarFabricante = async (fabricante) => {
    try {
      // Envía una solicitud DELETE a la API para eliminar el fabricante
      console.log(fabricante.codigo)
      const response = await fetch(
        `http://localhost:3001/fabricantes/${fabricante.codigo}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Si la solicitud fue exitosa, actualiza el estado de los fabricantes sin el fabricante eliminado
        obtenerFabricantes();
        const fabricantesActualizados = fabricantes.filter(
          (f) => f.codigo !== fabricante.codigo
        );
        setFabricantes(fabricantesActualizados);
      } else {
        // Maneja el caso en que la solicitud no sea exitosa
        console.error("Error al eliminar el fabricante");
      }
    } catch (error) {
      console.error("Error al comunicarse con la API", error);
    }
  };

  const handleAbrirModalEditar = (fabricante) => {
    setFabricanteSeleccionado(fabricante);
    setShowModal(true);
  };

  const handleAbrirModalAdd = () => {
    setShowModalAdd(true);
  };

  const handleGuardarCambios = async () => {
    try {
      // Envía una solicitud PUT a la API para actualizar el fabricante
      const response = await fetch(
        `http://localhost:3001/fabricantes/${fabricanteSeleccionado.codigo}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fabricanteSeleccionado),
        }
      );

      if (response.ok) {
        // Si la solicitud fue exitosa, actualiza el estado de los fabricantes con los cambios guardados
        const fabricantesActualizados = fabricantes.map((f) =>
          f.codigo === fabricanteSeleccionado.codigo
            ? fabricanteSeleccionado
            : f
        );
        setFabricantes(fabricantesActualizados);
        setShowModal(false);
        setFabricanteSeleccionado({});
      } else {
        // Maneja el caso en que la solicitud no sea exitosa
        console.error("Error al guardar los cambios del fabricante");
      }
    } catch (error) {
      console.error("Error al comunicarse con la API", error);
    }
  };
  
  const generateCSVContent = () => {
    const csvContent = "data:text/csv;charset=utf-8," + fabricantes.map(fabricantes => Object.values(fabricantes).join(",")).join("\n");
    return csvContent;
  };

  const handleExportCSV = () => {
    const csvContent = generateCSVContent();
    downloadCSV(csvContent);
  };

  const downloadCSV = (csvContent) => {
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['#', 'Nombre']],
      body: fabricantes.map(fabricantes => [fabricantes.codigo, fabricantes.nombre]),
    });

    doc.save('tabla.pdf');
  };
  
  const handlePrint = () => {
    const table = document.getElementById('myTable');
    if (table) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Tabla para imprimir</title>
          </head>
          <body>
            ${table.outerHTML}
            <script type="text/javascript">
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(fabricantes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tabla');
    XLSX.writeFile(workbook, 'tabla.xlsx');
  };
  



  return (
    <div style={{ display: "flex", flex: '0 0 70%', margin: '0 0 0 0', alignItems: "center" }}>
      <Container>
        <Row>
          <Col >
            <div class="card">
              <div class="card-info">
                <Button
                  variant="outline-success"
                  onClick={() => handleAbrirModalAdd()}
                >
                  Agregar nuevo
                </Button>
                
                <Button onClick={handleExportCSV} style={{margin:"3px"}}>Exportar a CSV</Button>
                <Button onClick={handlePrint} style={{margin:"3px"}}>Imprimir</Button>
                <Button onClick={exportToExcel} style={{margin:"3px"}}>Exportar a Excel</Button>
                <Button onClick={exportToPDF} style={{margin:"3px"}}>Exportar a PDF</Button>

              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table striped bordered hover style={{ width: "100%" }} id="myTable">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Actualizar</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {fabricantes.map((fabricante, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{fabricante.nombre}</td>
                    <td>
                      <Button
                        variant="outline-warning"
                        onClick={() => handleAbrirModalEditar(fabricante)}
                      >
                        Actualizar
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleEliminarFabricante(fabricante)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>

      {/* Modal de edición */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Fabricante</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formFabricanteModal">
              <Form.Label>Fabricante</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre fabricante"
                value={fabricanteSeleccionado.nombre || ""}
                onChange={(e) =>
                  setFabricanteSeleccionado({
                    ...fabricanteSeleccionado,
                    nombre: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardarCambios}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de crear */}
      <Modal show={showModalAdd} onHide={() => setShowModalAdd(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Fabricante</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formFabricante">
              <Form.Label>Fabricante</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre fabricante"
                value={fabricanteSeleccionado.nombre || ""}
                onChange={(e) =>
                  setFabricanteSeleccionado({
                    ...fabricanteSeleccionado,
                    nombre: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalAdd(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAgregarFabricante}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};
