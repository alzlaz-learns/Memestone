import React, { Component } from "react";
import UploadService from "../services/file-upload.service";
import AuthService from "../services/auth.service";//for database submissions
import { Redirect } from "react-router-dom";


export default class UploadImages extends Component {
  constructor(props) {
    super(props);
    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);

    this.state = {
      
      currentFile: undefined,
      previewImage: undefined,
      progress: 0,
      message: "",
      
      uploadName: "", //AL - added as an attempt to alter name

      imageInfos: [],

      redirect: null,
      userReady: false,
      currentUser: { username: "" },
      
    };

  }


  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/login" });

    UploadService.getFiles().then((response) => {
      this.setState({
        imageInfos: response.data,
      });
    });
    this.setState({ currentUser: currentUser, userReady: true });
  }



  selectFile(event) {
    this.setState({
      currentFile:  event.target.files[0],
      previewImage: URL.createObjectURL(event.target.files[0]),
      progress: 0,
      message: "",
      id: 0,
      username: "",
      uploadName: event.target.files[0].name
    });
  }

  upload() {
    this.setState({
      progress: 0,
    });

    //this.setState({currentFile: Date.now() + this.state.currentFile.name});//AL trying shit out
    // console.log(this.state.currentFile.name);

    UploadService.upload(this.state.currentFile, {
      id: this.state.currentUser.id,
      username: this.state.currentUser.username,
      filename: this.state.currentFile.name
    },(event) => {


      this.setState({
        progress: Math.round((100 * event.loaded) / event.total),
      });
    })
      .then((response) => {
        this.setState({
          message: response.data.message,
          
        });
        return UploadService.getFiles();
      })
      .then((files) => {
        this.setState({
          imageInfos: files.data,
          
        });
        
          

      })
      .catch((err) => {
        this.setState({
          progress: 0,
          message: "Could not upload the image!",
          currentFile: undefined,
        });
      });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    const {
      
      currentFile,
      previewImage,
      progress,
      message

    } = this.state;

    
    return (
      <div className="jumbotron">
      <h3>Upload Meme</h3>
        <div className="col">
          <div className="row">
            <label className="btn btn-default p-0">
              <input type="file" accept="image/*" onChange={this.selectFile} />
            </label>
          </div>

            <div className="row">
              <button
                className="btn btn-success btn-sm"
                disabled={!currentFile}
                onClick={this.upload}
              >
                Upload
              </button>
          </div>
        </div>

        {currentFile && (
          <div className="progress my-3">
            <div
              className="progress-bar progress-bar-info progress-bar-striped"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: progress + "%" }}
            >
              {progress}%
            </div>
          </div>
        )}

        {previewImage && (
          <div>
            <img className="preview" src={previewImage} alt="" />
          </div>
        )}

        {message && (
          <div className="alert alert-secondary mt-3" role="alert">
            {message}
          </div> 
        )}
      </div>
      
    );
  }
}