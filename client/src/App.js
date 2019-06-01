import React, { Component, Fragment } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  ListGroup,
  ListGroupItem,
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormText
} from "reactstrap";
import { connect } from "react-redux";

// import Alert from "./components/common/Alert";
// import TypingIndicator from "./components/common/TypingIndicator";

import {
  createNewRoom,
  getAllRoom,
  createNewUser,
  getCurrentUserOnline,
  joinRoom,
  leaveRoom,
  sendMessage,
  userTyping
} from "./socket";

class App extends Component {
  state = {
    modal: false,
    roomName: "",
    name: "",
    message: "",
    selectedRoom: ""
  };

  componentDidMount() {
    const { dispatch } = this.props;
    getAllRoom(dispatch);
    getCurrentUserOnline(dispatch);
  }

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };

  // create a new user
  createNewUser = e => {
    e.preventDefault();

    const { dispatch } = this.props;
    dispatch({ type: "SET_CURRENT_NAME", name: this.state.name });
    createNewUser(this.state.name);
  };

  // Create a new room event
  createNewRoom = e => {
    e.preventDefault();

    createNewRoom(this.state.roomName);
    this.setState(prevState => ({
      modal: !prevState.modal,
      roomName: ""
    }));
  };

  // user able to join chat rooms
  joinChatRoom = (e, roomName) => {
    joinRoom(roomName);
    this.setState({ selectedRoom: roomName });
  };

  leaveChatRoom = (e, roomName) => {
    leaveRoom(roomName);
    this.setState({ selectedRoom: "" });
  };

  // Send message
  sendNewMessage = e => {
    e.preventDefault();

    sendMessage(this.state.message, this.state.selectedRoom);
    this.setState({ message: "" });

    console.log("sent message to " + this.state.selectedRoom);
  };

  // On Change Handler
  onChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  // Keypress Handler
  _handleKeyUp = (e, name) => {
    if (e.key === "Enter" && this.state.message !== "") {
      this.sendNewMessage(e);
      return userTyping(null);
    }

    if (this.state.message.length === 0) {
      // send to server
      return userTyping(null);
    }

    // send to server
    return userTyping(name);
  };

  render() {
    const {
      rooms,
      names,
      name,
      messages,
      joinedRoom,
      selectedRoom,
      userTyping
    } = this.props.reducer;
    let renderBody, updatedRooms, updatedUsers, updatedMessages, btnControl;

    // Updated rooms
    if (rooms.length > 0 || joinedRoom) {
      updatedRooms = rooms.map(room =>
        room.uid === selectedRoom.uid ? (
          <ListGroupItem
            className="active"
            key={room.uid}
            style={{ cursor: "pointer" }}
            onClick={e => this.joinChatRoom(e, room.roomName)}
          >
            {room.roomName}
          </ListGroupItem>
        ) : (
          <ListGroupItem
            key={room.uid}
            style={{ cursor: "pointer" }}
            onClick={e => this.joinChatRoom(e, room.roomName)}
          >
            {room.roomName}
          </ListGroupItem>
        )
      );
    }

    // Updated users
    if (names.length > 0) {
      updatedUsers = names.map(name => (
        <ListGroupItem key={name.uid} style={{ cursor: "pointer" }}>
          {name.name}
        </ListGroupItem>
      ));
    }

    // Updated messages
    if (messages.length > 0) {
      updatedMessages = messages.map(
        message =>
          message.room.roomName === selectedRoom.roomName && (
            <ListGroupItem key={message.uid} style={{ cursor: "pointer" }}>
              {message.user.name}: {message.msg}
            </ListGroupItem>
          )
      );
    }

    if (joinedRoom) {
      btnControl = (
        <Button
          type="button"
          className="btn-md btn-block"
          color="danger"
          onClick={e => this.leaveChatRoom(e, this.state.selectedRoom)}
        >
          Leave Room
        </Button>
      );
    } else {
      btnControl = (
        <Button
          type="button"
          className="btn-md btn-block"
          color="primary"
          onClick={this.toggle}
        >
          Create Room
        </Button>
      );
    }

    if (name === "") {
      renderBody = (
        <div className="container">
          <Form
            style={{
              width: 500,
              margin: "0 auto",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }}
            onSubmit={e => this.createNewUser(e)}
          >
            <FormGroup>
              <Label for="name">Enter a name</Label>
              <Input
                type="text"
                name="name"
                id="nameBox"
                value={this.state.name}
                onChange={e => this.onChangeHandler(e)}
              />
              <FormText color="muted">
                Your name must be between 6 to 30 characters long
              </FormText>
            </FormGroup>
            <Button type="submit" color="success" className="btn-md btn-block">
              Submit
            </Button>
          </Form>
        </div>
      );
    } else {
      renderBody = (
        <div className="container mt-3">
          <div className="row">
            <div className="col-sm-4">
              <Card>
                <CardBody style={{ height: "450px", overflow: "auto" }}>
                  <CardHeader>
                    <h4 style={{ textAlign: "center" }}>Available Rooms</h4>
                  </CardHeader>
                  <ListGroup id="rooms">{updatedRooms}</ListGroup>
                </CardBody>
                <CardFooter>
                  {btnControl}
                  <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    className={this.props.className}
                    centered={true}
                  >
                    <ModalHeader toggle={this.toggle}>
                      Create your new room
                    </ModalHeader>
                    <Form
                      onSubmit={e => this.createNewRoom(e)}
                      className="form"
                    >
                      <ModalBody>
                        <FormGroup>
                          <Label for="serverName">Room Name</Label>
                          <Input
                            type="text"
                            name="roomName"
                            id="roomName"
                            value={this.state.roomName}
                            onChange={e => this.onChangeHandler(e)}
                          />
                          <FormText color="muted">
                            Room name must be between 6 to 30 characters long
                          </FormText>
                        </FormGroup>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="primary" type="submit">
                          Create
                        </Button>
                        <Button color="secondary" onClick={this.toggle}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </Form>
                  </Modal>
                </CardFooter>
              </Card>
            </div>
            <div className="col-lg">
              <Card>
                <CardBody style={{ height: "480px", overflow: "auto" }}>
                  <ListGroup id="messages">{updatedMessages}</ListGroup>
                </CardBody>
              </Card>
              <div style={{ textAlign: "right" }} id="typeIndicator">
                {userTyping ? userTyping + " is typing a message..." : <span />}
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-sm-4">
              <Card className="text-center">
                <CardBody style={{ height: "320px", overflow: "auto" }}>
                  <CardHeader>
                    <h4>Online Users</h4>
                  </CardHeader>
                  <ListGroup id="users">{updatedUsers}</ListGroup>
                </CardBody>
                <CardFooter className="text-muted">
                  Updated 5 second ago...
                  <span style={{ float: "right", cursor: "pointer" }}>
                    <i className="fa fa-refresh" aria-hidden="true" />
                  </span>
                </CardFooter>
              </Card>
            </div>
            {this.state.selectedRoom ? (
              <div className="col-sm mb-3 mt-3">
                <Form onSubmit={e => this.sendNewMessage(e)} className="form">
                  <FormGroup>
                    <Label for="message">Enter Message</Label>
                    <Input
                      type="textarea"
                      name="message"
                      id="messageBox"
                      rows="5"
                      style={{ resize: "none" }}
                      value={this.state.message}
                      onChange={e => this.onChangeHandler(e)}
                      onKeyUp={e => this._handleKeyUp(e, name)}
                    />
                  </FormGroup>
                  <Button type="submit" color="success submitBtn">
                    Send Message
                  </Button>
                </Form>
                <div className="info">
                  <span>Your name: {name}</span>
                  <br />
                  {names.map(
                    n =>
                      n.name === name && (
                        <span key={n.uid}>Your id: {n.uid}</span>
                      )
                  )}
                  <br />
                  <span>
                    {this.state.selectedRoom === ""
                      ? "Selected Room: None"
                      : "Selected Room: " + selectedRoom.roomName}
                  </span>
                </div>
              </div>
            ) : (
              <div className="col-sm mb-3 mt-3">
                <div className="info">
                  <span>Your name: {name}</span>
                  <br />
                  {names.map(
                    n =>
                      n.name === name && (
                        <span key={n.uid}>Your id: {n.uid}</span>
                      )
                  )}
                  <br />
                  <span>
                    {this.state.selectedRoom === ""
                      ? "Selected Room: None"
                      : "Selected Room: " + selectedRoom.roomName}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return <Fragment>{renderBody}</Fragment>;
  }
}

const mapStateToProps = state => ({
  reducer: state.reducer
});

export default connect(mapStateToProps)(App);
