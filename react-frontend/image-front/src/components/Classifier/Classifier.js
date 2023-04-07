import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import './Classifier.css';
import { Alert, Button, Image, Spinner, Form, FormControl, ProgressBar } from 'react-bootstrap';
import axios from 'axios'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

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

export function getEth0IPAddress() {
  return axios.get('/api/get_eth0_ip/')
    .then(response => {
      return response.data.eth0_ip; // change 'ip_address' to 'eth0_ip'
    })
    .catch(error => {
      console.log(error);
    });
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
        showProcessedImage: false,
        analyzedInfo: null,
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
                isLoading: false,
                showProcessedImage: false
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
      let formData = new FormData();
      formData.append('image', this.state.files[0], this.state.files[0].name);
      formData.append('e_hr', this.state.e_hr); // add e_hr data to FormData
      formData.append('e_min', this.state.e_min); // add e_min data to FormData
      getEth0IPAddress().then(ipAddress => {
        axios.post(`https://www.zeroexposure1905.com/api/images/`, formData, {
          headers: {
            'accept': 'application/json',
            'content-type': 'multipart/form-data',
          },
        })
          .then(resp => {
            this.getImageResults(resp);
            console.log(resp.data);
          })
          .catch(err => {
            console.log('Error Message here: ' + err);
          });
      });
    }
    
    getImageResults = (object) => {
      getEth0IPAddress().then(ipAddress => {
        axios.get(`https://www.zeroexposure1905.com/api/images/${object.data.id}/`, {
          headers: {
            'accept': 'application/json',
          },
        })
          .then(resp => {
            this.setState({ recentImage: resp, analyzedInfo: resp.data.analyzed_info });
            console.log(resp);
          })
          .catch(err => {
            console.log('Error Message here: ' + err);
          });
        this.deactivateSpinner();
      });
    }
    
    showProcessedImage = async () => {
      const ipAddress = await getEth0IPAddress();
      axios.get(`https://www.zeroexposure1905.com${this.state.recentImage.data.processed_image}`, {
        headers: {
          'accept': 'image/png, image/jpeg',
        },
        responseType: 'blob',
      })
        .then(resp => {
          this.getImageResults(resp);
          console.log(resp.data);
          this.setState({ showProcessedImage: false }); // Add this line to hide the processed image initially
        })
        .catch(err => {
          console.log('Error Message here: ' + err);
        });
      this.setState({ showProcessedImage: true });
    }
    

    hideProcessedImage = () => {
        this.setState({ showProcessedImage: false });
    }



    render() {
        // console.log('e_hr :' + this.state.e_hr)
        // console.log('e_min :' + this.state.e_min)
        const files = this.state.files.map(file => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <li key={file.name} style={{ margin: 'auto' }}>
              {file.name} - {file.size} bytes
            </li>
          </div>
        ));

        return (
            <Dropzone onDrop={this.onDrop} accept='image/png, image/jpeg'>
            {({ isDragActive, getRootProps, getInputProps }) => (
              <section className="container">
                <div {...getRootProps({ className: 'dropzone back' })} style={{display: 'flex', flexDirection: 'column', justifyContent: 'center',alignItems: 'center'}}>
                  <input {...getInputProps()} />
                  <i className="far fa-images mb-2 text-muted" style={{ fontSize: 100 }}></i>
                  <p className='text-muted'>{isDragActive ? "Drop some images" : "Drag 'n' drop some files here, or click to select files"}</p>
                </div>
                <aside>
                  {files}
                </aside>
                <Form>
                  {this.state.recentImage ? null : ( // Add this line to conditionally render the Form component
                    <React.Fragment>
                      <div className="row" style={{marginTop: '5px'}}>
                        <label for="exposure_hour" className="col-sm-2 col-form-label">
                          Exposure Hour
                        </label>
                        <div className="col-sm-10">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter the expected exposure time"
                            id="exposure_hour"
                            name="e_hr"
                            value={this.state.e_hr}
                            onChange={this.handleEhrChange}
                            min="0"
                          ></input>
                        </div>
                      </div>

                      <div className="row">
                        <label for="exposure_min" className="col-sm-2 col-form-label">
                          Exposure Minute
                        </label>
                        <div className="col-sm-10">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter the expected exposure time"
                            id="exposure_min"
                            name="e_min"
                            value={this.state.e_min}
                            onChange={this.handleEminChange}
                            min="0"
                          ></input>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
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
                        <Alert variant='warning' style={{ marginTop: '12px'}}>
                            <div className="auto-line-break analyzed-results">{this.state.recentImage.data.analyzed}</div>
                        </Alert>
                    }
                    {!this.state.recentImage.data.analyzed.includes('Failed') && Number(this.state.recentImage.data.analyzed) <= 100 ? (
                        <Alert variant='primary' style={{ marginTop: '12px'}}>
                            <div className="auto-line-break analyzed-results">Ozone exposure level<br></br><b>{Math.round(this.state.recentImage.data.analyzed)}</b> ppb</div>
                        </Alert>
                    ) : !this.state.recentImage.data.analyzed.includes('Failed') && (
                        <Alert variant='danger' style={{ marginTop: '12px'}}>
                            <div className="auto-line-break analyzed-results">Ozone exposure level<br></br> <b>{Math.round(this.state.recentImage.data.analyzed)}</b> ppb</div>
                        </Alert>
                    )}
                    {!this.state.recentImage.data.analyzed.includes('Failed') && 
                        <div className="circular-progress-bar" style={{marginTop: '13px !important'}}>
                          <CircularProgressbar
                            value={Number(this.state.recentImage.data.analyzed)}
                            text={
                              Number(this.state.recentImage.data.analyzed) <= 100 ? 'SAFE' : 'DANGER'
                            }
                            styles={buildStyles({
                              fontSize: '14px',
                              textColor: Number(this.state.recentImage.data.analyzed) <= 100 ? '#007bff' : '#dc3545',
                              pathColor: Number(this.state.recentImage.data.analyzed) <= 100 ? '#007bff' : '#dc3545',
                              trailColor: '#f2f2f2',
                            })}
                          >
                          </CircularProgressbar>
                        </div>
                    }
                    <div className="image-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                      {this.state.recentImage && (
                        <React.Fragment>
                          {this.state.showProcessedImage ? (
                            <React.Fragment>                      
                              <Button style={{ marginTop: '0px', marginBottom: '30px', fontSize: '15px', width: '220px', height: '40px' }} variant="primary" size="lg" className="mt-3 mx-auto" onClick={this.hideProcessedImage}>Hide Processed Image</Button>
                              <div style={{border: '2px solid #ccc', borderRadius: '4px',padding: '3px',marginTop: '0px', marginBottom: '30px'}}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><b style={{ color: 'gray' ,fontStyle: 'italic'}}>Processed Data</b>
                                  <Image
                                    className='justify-content-center'
                                    src={this.state.recentImage.data.processed_image}
                                    height='300'
                                    alt="File not Loaded"
                                    rounded
                                    align="center"
                                    style={{ marginTop: '0px', marginBottom: '7px' }}
                                  />
                                  <div className="analyzed-info-container">
                                      {this.state.analyzedInfo && (
                                        <div className="analyzed-info auto-line-break" style={{ marginBottom: '0px !important' }}>
                                          <b style={{ color: 'gray' ,fontStyle: 'italic'}}><p>{this.state.analyzedInfo}</p></b>
                                        </div>
                                      )}
                                  </div>
                                </div>
                              </div>
                            </React.Fragment>
                          ) : (
                            <Button style={{ marginTop: '0px', marginBottom: '30px', fontSize: '15px', width: '220px', height: '40px' }} variant="primary" size="lg" className="mt-3 mx-auto" onClick={this.showProcessedImage}>Show Processed Image</Button>
                          )}
                        </React.Fragment>
                      )}
                    </div>
                      </React.Fragment>
                    }
              </section>
            )}
          </Dropzone>
        );
      }
}

export default Classifier;


// This error is caused by running out of the inotify watches limit. You can fix it by increasing the inotify limit.

// You can try running the following command to temporarily increase the limit:

// Copy code
// sudo sysctl fs.inotify.max_user_watches=524288
// If this works, you can make the change permanent by adding the following line to the end of the /etc/sysctl.conf file:

// Copy code
// fs.inotify.max_user_watches=524288
// Then, save the file and run the following command to apply the changes:


// sudo sysctl -p
// After this, you should be able to run npm start without encountering the ENOSPC error.