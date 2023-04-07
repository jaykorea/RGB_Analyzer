import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import './Classifier.css';
import { Alert, Button, Image, Spinner, Form, FormControl } from 'react-bootstrap';
import axios from 'axios'


export function getIPv4Address(hostname) {
    let ip = "";
    const pattern = /^\d+\.\d+\.\d+\.\d+$/;
    if (hostname.match(pattern)) {
        ip = hostname;
    } else {
        const regex = /(\d+\.\d+\.\d+\.\d+)/gm;
        const match = regex.exec(hostname);
        if (match && match.length > 1) {
            ip = match[1];
        }
    }
    return ip;
}

class Classifier extends Component {
    state = {
        files: [],
        isLoading: false,
        isAnalyzing: false,
        recentImage: null,
        e_hr: '', // add state variable for e_hr
        e_min: '', // add state variable for e_min
        showMessage: false,
        isMultipleimages: false,
    }

    // event handler for e_hr input field
    handleEhrChange = (event) => {
        this.setState({ e_hr: event.target.value });
    }

    // event handler for e_min input field
    handleEminChange = (event) => {
        this.setState({ e_min: event.target.value });
    }

    onDrop = (files) => {
        if (files.length > 1) {
            this.setState({ isMultipleimages: true });
            return;
        }
        this.setState({
            isLoading: true,
            files: [],
            recentImage: null,
            isMultipleimages: false, // Reset the state when a single image is uploaded
        })
        this.loadingImage(files)
    }

    loadingImage = (files) => {
        setTimeout(() => {
            this.setState({
                files,
                isLoading: false
            }, () => {
                console.log(this.state.files[0].name)
            })
        }, 1000);
    }
    analyzingImage = () => {
        setTimeout(() => {
            this.setState({
                isAnalyzing: false
            }, () => {
                console.log(this.state.files[0].name)
            })
        }, 1000);
    }
    activateSpinner = () => {
        this.setState({
            isLoading: true,
            isAnalyzing: true,
            files: []
        })
    }

    deactivateSpinner = () => {
        this.setState({
            isLoading: false,
            isAnalyzing: false,
        })
    }

    handleDisabledClick = () => {
        this.setState({ showMessage: true });
        // setTimeout(() => {
        //     this.setState({ showMessage: false });
        // }, 1000); // Show the message for 3 seconds
    }

    sendImage = () => {
        this.setState({
            isLoading: false,
            isAnalyzing: true,
            files: []
        });
        let formData = new FormData()
        formData.append('image', this.state.files[0], this.state.files[0].name)
        formData.append('e_hr', this.state.e_hr); // add e_hr data to FormData
        formData.append('e_min', this.state.e_min); // add e_min data to FormData
        const ipAddress = getIPv4Address(window.location.host)
        axios.post(`http://${ipAddress}:8001/api/images/`, formData, {
            headers: {
                'accept': 'application/json',
                'content-type': 'multipart/form-data',
            }
        })
            .then(resp => {
                this.getImageResults(resp)
                console.log(resp.data)
            })
            .catch(err => {
                console.log('Error Message here: ' + err)
            })
    }

    getImageResults = (object) => {
        const ipAddress = getIPv4Address(window.location.host)
        axios.get(`http://${ipAddress}:8001/api/images/${object.data.id}/`, {
            headers: {
                'accept': 'application/json',
            }
        })
            .then(resp => {
                this.setState({ recentImage: resp })
                console.log(resp)
            })
            .catch(err => {
                console.log('Error Message here: ' + err)
            })
        this.deactivateSpinner()
    }



    render() {
        // console.log('e_hr :' + this.state.e_hr)
        // console.log('e_min :' + this.state.e_min)
        const files = this.state.files.map(file => (
            <li key={file.name}>
                {file.name} - {file.size} bytes
            </li>
        ));

        return (
            <Dropzone onDrop={this.onDrop} accept='image/png, image/jpeg'>
            {({ isDragActive, getRootProps, getInputProps }) => (
              <section className="container">
                <div {...getRootProps({ className: 'dropzone back' })}>
                  <input {...getInputProps()} />
                  <i className="far fa-images mb-2 text-muted" style={{ fontSize: 100 }}></i>
                  <p className='text-muted'>{isDragActive ? "Drop some images" : "Drag 'n' drop some files here, or click to select files"}</p>
                </div>
                <aside>
                  {files}
                </aside>
                <Form>
                <div class="row">
                    <label for="exposure_hour" class="col-sm-2 col-form-label">Exposure Hour</label>
                    <div class="col-sm-10">
                      <input type="number" class="form-control" placeholder="Enter the expected exposure time" id="exposure_hour" name="e_hr" value={this.state.e_hr} onChange={this.handleEhrChange} min="0"></input>
                    </div> 
                </div>

                <div class="row">      
                    <label for="exposure_min" class="col-sm-2 col-form-label">Exposure Minute</label>
                    <div class="col-sm-10">
                      <input type="number" class="form-control" placeholder="Enter the expected exposure time" id="exposure_min" name="e_min" value={this.state.e_min} onChange={this.handleEminChange} min="0"></input>
                    </div>
                </div>          
                </Form>
                {this.state.files.length > 0 && (
                  (this.state.e_hr !== "" && this.state.e_min !== "")  && (parseInt(this.state.e_hr) >= 0 && parseInt(this.state.e_min) >= 0) && (parseInt(this.state.e_hr) !== 0 || parseInt(this.state.e_min) !== 0) ? (
                    <Button variant="info" size="lg" className="mt-3" onClick={this.sendImage}>Analyze</Button>
                  ) : (
                    <Button variant="info" size="lg" className="mt-3" onClick={this.handleDisabledClick}>Analyze</Button>
                  )
                )}
                {this.state.showMessage && (this.state.e_hr === "" || this.state.e_min === "") &&
                    <Alert variant='warning' style={{ marginTop: '13px' }}>Please fill in both 'Exposure Hour' and 'Exposure Minute' fields.</Alert>
                }
                {this.state.showMessage && (parseInt(this.state.e_hr) === 0 && parseInt(this.state.e_min) === 0) &&
                    <Alert variant='warning' style={{ marginTop: '13px' }}>At least one of them should be 1 or greater.</Alert>
                }
                {this.state.showMessage && (parseInt(this.state.e_hr) < 0 || parseInt(this.state.e_min) < 0) &&
                    <Alert variant='warning' style={{ marginTop: '13px' }}>Please enter only non-negative values for 'Exposure Hour' and 'Exposure Minute'.</Alert>
                }
                {this.state.isMultipleimages &&
                    <Alert variant='warning' style={{ marginTop: '13px' }}>Please upload only one image at a time.</Alert>
                }
                {this.state.isLoading &&
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Spinner animation="border" role="status" style={{ marginTop: '50px' }} />
                        <div style={{ textAlign: 'center', marginTop: '5px' }}>Loading...</div>
                    </div>
                }
                {this.state.isAnalyzing &&
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Spinner animation="border" role="status" style={{ marginTop: '50px' }} />
                        <div style={{ textAlign: 'center', marginTop: '5px' }}>Analyzing...</div>
                    </div>
                }
                {this.state.recentImage &&
                  <React.Fragment>
                    {this.state.recentImage.data.analyzed.includes('Failed') && 
                        <Alert variant='warning' style={{ marginTop: '13px'}}>
                            <div className="auto-line-break analyzed-results">{this.state.recentImage.data.analyzed}</div>
                        </Alert>
                    }
                    {!this.state.recentImage.data.analyzed.includes('Failed') && Number(this.state.recentImage.data.analyzed) <= 100 ? (
                        <Alert variant='primary' style={{ marginTop: '13px'}}>
                            <div className="auto-line-break analyzed-results">Ozone exposure level : <b>{this.state.recentImage.data.analyzed}</b> ppb<br></br><b>SAFE</b></div>
                        </Alert>
                    ) : !this.state.recentImage.data.analyzed.includes('Failed') && (
                        <Alert variant='danger' style={{ marginTop: '13px'}}>
                            <div className="auto-line-break analyzed-results">Ozone exposure level : <b>{this.state.recentImage.data.analyzed}</b> ppb<br></br><b>DANGER</b></div>
                        </Alert>
                    )}
                    <Image className='justify-content-center mb-5'src={this.state.recentImage.data.processed_image} height='200' alt="File not Loaded" rounded align="center"/>
      
                  </React.Fragment>}
              </section>
            )}
          </Dropzone>
        );
      }
}

export default Classifier;

