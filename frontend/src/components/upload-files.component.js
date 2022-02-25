import React, { Component } from "react";
import UploadService from "../services/file-upload.service";
import AuthService from "../services/auth.service";//for database submissions
import { Redirect } from "react-router-dom";


//front end of single image upload service

/*
  by clicking the choose file 
  Uses html to accept a file from our input type tag 
  we use URL.createObjectURL() to create an image URL
  we then display that in our html to an image tag
  then we can choose to upload 
  this will make a call to our service file-upoad.service

  it will display a progress bar for uploading and show if the file was successfully upload.

*/

export default class UploadImages extends Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

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
    this._isMounted = true;
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) this._isMounted && this.setState({ redirect: "/login" });

    UploadService.getFiles().then((response) => {
      this._isMounted && this.setState({
        imageInfos: response.data,
      });
    });
    this._isMounted && this.setState({ currentUser: currentUser, userReady: true });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }



  selectFile(event) {

    //helps us g
    this._isMounted && this.setState({
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
    this._isMounted && this.setState({
      progress: 0,
    });

    UploadService.upload(this.state.currentFile, {
      id: this.state.currentUser.id,
      username: this.state.currentUser.username,
      filename: this.state.currentFile.name
    },(event) => {


      this._isMounted && this.setState({
        progress: Math.round((100 * event.loaded) / event.total),
      });
    })
      .then((response) => {
        this._isMounted && this.setState({
          message: response.data.message,
          
        });
        return UploadService.getFiles();
      })
      .then((files) => {
        this._isMounted && this.setState({
          imageInfos: files.data,
          
        });
        
          

      })
      .catch((err) => {
        this._isMounted && this.setState({
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