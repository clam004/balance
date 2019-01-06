import React, { Component } from 'react';
import axios from 'axios';

class Upload extends Component {
  constructor () {
    super();
    this.state = {
      file: null
    };
  }

  submitFile = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', this.state.file[0]);
    axios.post(`/aws/test-upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      // handle your response;
    }).catch(error => {
      // handle your error
    });
  }

  handleFileUpload = (event) => {
    this.setState({file: event.target.files});
  }

  render () {
    return (
      <form onSubmit={this.submitFile}>
        <input label='upload file' type='file' onChange={this.handleFileUpload} />
        <button type='submit'>Send</button>
      </form>
    );
  }
}

export default Upload;

/*

const config = {
    bucketName: process.env.S3_BUCKET_NAME,
    //dirName: 'test', 
    region: 'us-west-1',
    accessKeyId:  process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
}

  upload(e){
    console.log(e.target.files[0])
    S3FileUpload.uploadFile(e.target.files[0],config)
    .then((res) => {
      console.log("res",res)
    })
    .catch(err => {
      console.log("err",err)
    });
  }

  render() {
    return (
      <div className="dashboard-container">
        <SideNav />
        <div>
        </div>

        <input 
        type = "file"
        onChange = {this.upload}
        />
      </div>
    );
  }
}



          <form onSubmit={this.submitFile}>
            <input type='file' onChange={this.handleFileUpload} />
            <button type='submit'>Send</button>
          </form>

*/