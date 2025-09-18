import { Spinner, Card, Button } from "react-bootstrap";

function CardCounter({content, handleClick, buttonText, cardText}) {
    return(
        <Card style={{display: 'inline-block', marginRight: '1rem' }} className="mb-4 w-100">
            <Card.Body>
                <Card.Title>{cardText}</Card.Title>
                <Card.Text style={{ fontSize: '3rem', fontWeight: 'bold'}}>
                    {content}
                </Card.Text>
                <Button variant="primary" onClick={handleClick}>{buttonText}</Button>
            </Card.Body>
        </Card>
    )
}
export default CardCounter;