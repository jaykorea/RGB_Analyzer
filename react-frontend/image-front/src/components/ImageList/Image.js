import React from 'react';
import { Card } from 'react-bootstrap';

const Image = (props) => {
    return (
        <Card style={{ width: '20rem' }} className="mx-auto mb-1">
            <Card.Img variant="top" src={props.pict} />
            <Card.Body>
                <Card.Title>
                    Analyzed as<br/>
                </Card.Title>
                <div className="auto-line-break analyzed-results">{props.name}</div>
            </Card.Body>
        </Card>
    );
}
export default Image;