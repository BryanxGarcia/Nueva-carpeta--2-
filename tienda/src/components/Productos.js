import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import './fabricante.css'; // Estilos CSS del Sidebar

export const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [productoSeleccionado, setFroductoSeleccionado] = useState({});
  const [nombre, setNombre] = useState({});
  const [precio, setPrecio] = useState({});
  const [codigo_fabricante, setcodigo_fabricante] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFroductoSeleccionado({
      ...productoSeleccionado,
      [name]: value,
    });
  };

  // Función para obtener los productos desde la API
  const obtenerFabricantes = async () => {
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
  }, []);

  const handleAgregarProducto = async () => {
    try {
      console.log(nombre)
      console.log(precio)
      console.log(codigo_fabricante)
      var js = JSON.stringify({nombre:nombre.nombre, precio: precio.precio, codigo_fabricante:codigo_fabricante.codigo_fabricante });

      // Envía una solicitud POST a la API para agregar un nuevo producto
      const response = await fetch("http://localhost:3001/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: js,
      });
      

      if (response.ok) {
        setShowModalAdd(false);
        obtenerFabricantes();
        // Si la solicitud fue exitosa, actualiza el estado de los productos
        setProductos([...productos, productoSeleccionado]);
        setFroductoSeleccionado({});
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
        `http://localhost:3001/productos/eliminar/${producto.codigo}`,
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
    setFroductoSeleccionado(producto);
    setShowModal(true);
  };

  const handleAbrirModalAdd = () => {
    setShowModalAdd(true);
  };

  const handleGuardarCambios = async () => {
    try {
      // Envía una solicitud PUT a la API para actualizar el producto
      const response = await fetch(
        `http://localhost:3001/productos/actualizar/${productoSeleccionado.codigo}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productoSeleccionado),
        }
      );

      if (response.ok) {
        // Si la solicitud fue exitosa, actualiza el estado de los productos con los cambios guardados
        const fabricantesActualizados = productos.map((f) =>
          f.codigo === productoSeleccionado.codigo
            ? productoSeleccionado
            : f
        );
        setProductos(fabricantesActualizados);
        setShowModal(false);
        setFroductoSeleccionado({});
      } else {
        // Maneja el caso en que la solicitud no sea exitosa
        console.error("Error al guardar los cambios del producto");
      }
    } catch (error) {
      console.error("Error al comunicarse con la API", error);
    }
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
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table striped bordered hover style={{ width: "100%" }}>
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
                placeholder="Nombre producto"
                value={productoSeleccionado.nombre || ""}
                onChange={(e) =>
                  setFroductoSeleccionado({
                    ...productoSeleccionado,
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
              <Form.Control
                type="text"
                placeholder="Codigo de fabricante"
                value={codigo_fabricante.codigo_fabricante}
                onChange={(e) =>
                  setcodigo_fabricante({
                    ...codigo_fabricante,
                    codigo_fabricante: e.target.value,
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
          <Button variant="primary" onClick={handleAgregarProducto}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};
