import React, { useState, useEffect } from "react";
import { getAuth, updateProfile, updateEmail, signOut, sendPasswordResetEmail } from "firebase/auth";
import { Container, Row, Col, ListGroup, Button, Form } from "react-bootstrap";
import { FaUser, FaLock, FaFileAlt, FaShieldAlt, FaEdit, FaSignOutAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Perfil = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    if (auth.currentUser) {
      setUser(auth.currentUser);
      setNewName(auth.currentUser.displayName || "");
      setNewEmail(auth.currentUser.email || "");
    }
  }, [auth]);

  // Función para actualizar el nombre y correo
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      if (newName !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName: newName });
      }
      if (newEmail !== user.email) {
        await updateEmail(auth.currentUser, newEmail);
      }
      setUser({ ...auth.currentUser, displayName: newName, email: newEmail });
      setEditing(false);
      alert("Perfil actualizado correctamente");
    } catch (error) {
      alert("Error al actualizar perfil: " + error.message);
    }
  };

  // Función para cambiar la contraseña
  const handleChangePassword = async () => {
    try {
      await sendPasswordResetEmail(auth, user.email);
      alert("Correo de restablecimiento de contraseña enviado.");
      setChangingPassword(false);
    } catch (error) {
      alert("Error al enviar correo: " + error.message);
    }
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Sesión cerrada");
      window.location.reload();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <h2>Perfil</h2>
          <ListGroup>
            <ListGroup.Item>
              <FaUser /> Nombre: {`${user ? user.displayName || "Usuario" : "Cargando..."}`}
            </ListGroup.Item>
            <ListGroup.Item>
              <FaFileAlt /> Correo: {user ? user.email : "Cargando..."}
            </ListGroup.Item>
            <ListGroup.Item>
              <FaShieldAlt /> UID: {user ? user.uid : "Cargando..."}
            </ListGroup.Item>
          </ListGroup>
          
          {/* Botones */}
          <Button variant="warning" className="mt-3" onClick={() => setEditing(!editing)}>
            <FaEdit /> Editar Información
          </Button>
          <Button variant="info" className="mt-3 mx-2" onClick={() => setChangingPassword(!changingPassword)}>
            <FaLock /> Cambiar Contraseña
          </Button>
          <Button variant="danger" className="mt-3" onClick={handleLogout}>
            <FaSignOutAlt /> Cerrar Sesión
          </Button>

          {/* Formulario para editar información */}
          {editing && (
            <Form className="mt-3" onSubmit={handleUpdateProfile}>
              <Form.Group className="mb-2">
                <Form.Label>Nuevo Nombre</Form.Label>
                <Form.Control type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Nuevo Correo</Form.Label>
                <Form.Control type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
              </Form.Group>
              <Button variant="success" type="submit">Guardar Cambios</Button>
              <Button variant="secondary" className="mx-2" onClick={() => setEditing(false)}>Cancelar</Button>
            </Form>
          )}

          {/* Formulario para cambiar contraseña */}
          {changingPassword && (
            <div className="mt-3">
              <p>Se enviará un correo para restablecer la contraseña.</p>
              <Button variant="primary" onClick={handleChangePassword}>Enviar Correo</Button>
              <Button variant="secondary" className="mx-2" onClick={() => setChangingPassword(false)}>Cancelar</Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Perfil;
