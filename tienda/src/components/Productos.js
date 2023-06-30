import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import './fabricante.css'; 
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';

export const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState({});
  const [nombre, setNombre] = useState({});
  const [precio, setPrecio] = useState({});
  const [codigo_fabricante, setcodigo_fabricante] = useState({});
  const [fabricantes, setFabricantes] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductoSeleccionado({
      ...productoSeleccionado,
      [name]: value,
    });
  };
  const obtenerFabricantes = async () => {
    try {
      const response = await fetch("http://localhost:3001/fabricantes");
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setFabricantes(data);
      } else {
        console.error("Error al obtener los fabricantes");
      }
    } catch (error) {
      console.error("Error al comunicarse con la API", error);
    }
  };
  // Función para obtener los productos desde la API
  const obtenerProductos = async () => {
    try {
      const response = await fetch("http://localhost:3001/productos");
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      } else {
        console.error("Error al obtener los productos");
      }
    } catch (error) {
      console.error("Error al comunicarse con la API", error);
    }
  };

  // Llamada a obtenerFabricantes cuando el componente se monta
  useEffect(() => {
    obtenerFabricantes();
    obtenerProductos();
  }, []);

  const handleAgregarProducto = async () => {
    try {
      console.log(nombre)
      console.log(precio)
      console.log(codigo_fabricante)
      var js = JSON.stringify({ nombre: nombre.nombre, precio: precio.precio, codigo_fabricante: codigo_fabricante.codigo_fabricante });

      // Envía una solicitud POST a la API para agregar un nuevo producto
      const response = await fetch("http://localhost:3001/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: js,
      });
      obtenerProductos();


      if (response.ok) {
        setShowModalAdd(false);
        obtenerFabricantes();
        // Si la solicitud fue exitosa, actualiza el estado de los productos
        setProductos([...productos, productoSeleccionado]);
        setProductoSeleccionado({});
      } else {
        // Maneja el caso en que la solicitud no sea exitosa
        console.error("Error al agregar el producto");
      }
    } catch (error) {
      console.error("Error al comunicarse con la API", error);
    }
  };

  const handleEliminarFabricante = async (producto) => {
    try {
      // Envía una solicitud DELETE a la API para eliminar el producto
      console.log(producto.codigo)
      const response = await fetch(
        `http://localhost:3001/productos/${producto.codigo}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Si la solicitud fue exitosa, actualiza el estado de los productos sin el producto eliminado
        obtenerFabricantes();
        const fabricantesActualizados = productos.filter(
          (f) => f.codigo !== producto.codigo
        );
        setProductos(fabricantesActualizados);
      } else {
        // Maneja el caso en que la solicitud no sea exitosa
        console.error("Error al eliminar el producto");
      }
    } catch (error) {
      console.error("Error al comunicarse con la API", error);
    }
  };

  const handleAbrirModalEditar = (producto) => {
    setProductoSeleccionado(producto);
    setShowModal(true);
  };

  const handleAbrirModalAdd = () => {
    setShowModalAdd(true);
  };

  const handleGuardarCambios = async () => {

    try {
      const bodienvio = JSON.stringify({ nombre: productoSeleccionado.nombre, precio: productoSeleccionado.precio, codigo_fabricante: Number(productoSeleccionado.codigo_fabricante) });
      const response = await fetch(
        `http://localhost:3001/productos/${productoSeleccionado.codigo}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: bodienvio,
        }
      );


      if (response.ok) {
        obtenerProductos();
        const productosActualizados = productos.map((f) =>
          f.codigo === productoSeleccionado.codigo
            ? productoSeleccionado
            : f
        );
        setProductos(productosActualizados);
        setShowModal(false);
        setProductoSeleccionado({});
      } else {
        // Maneja el caso en que la solicitud no sea exitosa
        console.error("Error al guardar los cambios del producto");
      }
    } catch (error) {
      console.error("Error al comunicarse con la API", error);
    }
  };

  const generateCSVContent = () => {
    const csvContent = "data:text/csv;charset=utf-8," + productos.map(productos => Object.values(productos).join(",")).join("\n");
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
      head: [['#', 'Nombre', 'Precio', 'Código fabricante']],
      body: productos.map(producto => [producto.codigo, producto.nombre, producto.precio, producto.codigo_fabricante]),
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
    const worksheet = XLSX.utils.json_to_sheet(productos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tabla');
    XLSX.writeFile(workbook, 'tabla.xlsx');
  };
  


  return (

    <div style={{ display: "flex", flex: '0 0 70%', alignItems: "center" }}>
      <Container>
        <Row>
          <Col >
            <div class="card">
              <div class="card-info">
                <Button onClick={() => handleAbrirModalAdd()}>
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
                  <th>Precio</th>
                  <th>Codigo fabricante</th>
                  <th>Actualizar</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{producto.nombre}</td>
                    <td>{producto.precio}</td>
                    <td>{producto.codigo_fabricante}</td>
                    <td>
                      <Button
                        variant="outline-warning"
                        onClick={() => handleAbrirModalEditar(producto)}
                      >
                        Actualizar
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleEliminarFabricante(producto)}
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


      {/* Modal de crear */}
      <Modal show={showModalAdd} onHide={() => setShowModalAdd(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="nombreP">
              <Form.Label>Fabricante</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre producto"
                value={nombre.nombre}
                onChange={(e) =>
                  setNombre({
                    ...nombre,
                    nombre: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="precioP">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="text"
                placeholder="Precio"
                value={precio.precio}
                onChange={(e) =>
                  setPrecio({
                    ...precio,
                    precio: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="codigoF">
              <Form.Label>Codigo</Form.Label>
              <Form.Select
                type="text"
                placeholder="Codigo de fabricante"
                value={codigo_fabricante.codigo_fabricante || ""}
                onChange={(e) =>
                  setcodigo_fabricante({
                    ...codigo_fabricante,
                    codigo_fabricante: e.target.value,
                  })
                } >{fabricantes.map((fabricante) => (
                  <option
                    value={fabricante.codigo}> {fabricante.nombre}</option>
                ))}
              </Form.Select>

            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalAdd(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAgregarProducto}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>


      {/* Modal de edición */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="nombreP">
              <Form.Label>Fabricante</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre producto"
                value={productoSeleccionado.nombre || ""}
                onChange={(e) =>
                  setProductoSeleccionado({
                    ...productoSeleccionado,
                    nombre: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="precioP">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="text"
                placeholder="Precio"
                value={productoSeleccionado.precio || ""}
                onChange={(e) =>
                  setProductoSeleccionado({
                    ...productoSeleccionado,
                    precio: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="codigoF">
              <Form.Label>Codigo</Form.Label>
              <Form.Select
                type="text"
                placeholder="Codigo de fabricante"
                value={productoSeleccionado.codigo_fabricante || ""}
                onChange={(e) =>
                  setProductoSeleccionado({
                    ...productoSeleccionado,
                    codigo_fabricante: e.target.value,
                  })
                } >{fabricantes.map((fabricante) => (
                  <option
                    value={fabricante.codigo}> {fabricante.nombre}</option>
                ))}
              </Form.Select>
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
    </div>
  );
};
