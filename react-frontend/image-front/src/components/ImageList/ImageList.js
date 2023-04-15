import React, { Component } from 'react';
import axios from 'axios';
import Image from './Image';
import { Button, Spinner } from 'react-bootstrap'
import { getReqUrlAddress } from '../GetUrl/GetUrl.js';
import { alignPropType } from 'react-bootstrap/esm/DropdownMenu';

class ImageList extends Component {
    state = {
        images: [],
        visible: 2,
        isLoading: true,
        newLoaded: false,
        status: false,
    }

    componentDidMount() {
        setTimeout(this.getImages, 1000)
    }

    getImages = () => {
        getReqUrlAddress().then(ipAddress => {
            axios.get(`${ipAddress}/api/images/`, {
                headers: {
                    'accept': 'application/json'
                }
            }).then(resp => {
                this.setState({
                    images: resp.data,
                    analyzedInfo: resp.data.analyzed_info,
                    status: true
                })
                console.log(resp)
            })
            this.setState({ isLoading: false })
        });
    }
    
    handleVisible = () => {
        const visible = this.state.visible
        const new_visible = visible + 2
        this.setState({ newLoaded: true })
        setTimeout(() => {
            this.setState({
                visible: new_visible,
                newLoaded: false,
            })
        }, 300);
    }

    render() {
        const images = this.state.images.slice(0, this.state.visible).map((img, index) => {
            return <Image key={img.id} pict={img.processed_image} name={img.analyzed} analyzedInfo={img.analyzed_info} id={index + 1} />
        });


        return (
            <div>
                <h3> Analysis of images</h3>
                {(this.state.images.length === 0) && (this.state.status) &&
                    <h3>No images Analyzed</h3>
                }
                {this.state.isLoading ?
                    <Spinner animation="border" role="status"></Spinner>
                    :
                    <React.Fragment>
                        {images}
                        {this.state.newLoaded &&
                            <Spinner animation="border" role="status"></Spinner>}
                        <br />
                        {(this.state.images.length > this.state.visible) && (this.state.images.length > 2) &&
                            <Button clasName="mb-5" variant='primary' size='lg' onClick={this.handleVisible} style={{marginBottom: '20px'}}>Load more</Button>
                        }
                        {(this.state.images.length <= this.state.visible) && (this.state.images.length > 0) &&
                            <p className="mb-3">No more images to load</p>}
                    </React.Fragment>
                }
            </div>
        );
    }
}

export default ImageList;



