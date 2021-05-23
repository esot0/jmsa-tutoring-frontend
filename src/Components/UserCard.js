import React from 'react'
import { Card, Button } from 'react-bootstrap';

//I want to keep same top image ratio
const UserCard = (props)  => {
    return (
<Card className="card user_card wide_card" >
    <Card.Img className="card-image" variant="top" src={props.profile_picture ?`http://localhost:5000/${props.profile_picture}` : 'http://localhost:5000/profile_pictures/placeholder.jpg'}/>
    <Card.Body>
      <Card.Title>{props.full_name}</Card.Title>
      <Card.Text>
        {props.bio.length >=20 ? <span className="card-body-text">{props.bio.substring(20)}...</span>: <span className="card-body-text">{props.bio}</span>}
      </Card.Text>
      <Button variant="primary" href={`/user/${props.username}`}>Profile</Button>
    </Card.Body>
  </Card>)
}

export default UserCard;