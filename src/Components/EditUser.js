import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useParams, useHistory } from "react-router-dom";
import { DateUtils } from "react-day-picker";
import DayPicker from 'react-day-picker/DayPicker';
import { axios_instance } from '..';
import { verifyJWT } from '../utility';
import ReactCrop from 'react-image-crop'
import "react-image-crop/dist/ReactCrop.css";

const EditUser = (props) => {
  let { username } = useParams();
  const jwt = verifyJWT()
  const history = useHistory();
  const [dates, setDates] = useState([]);
  const [isCropping, setIsCropping] = useState(false)
  const [upImg, setUpImg] = useState({ img: null, name: null });
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 3 / 3 });
  const [completedCrop, setCompletedCrop] = useState(null);

  const [user, set_user] = useState({});


  const onSelectFile = (e) => {

    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].size > 1500000) {
        alert("File is too big!");
        e.target.value = "";
      }
      else {
        setIsCropping(true);
        const reader = new FileReader();
        reader.addEventListener("load", () => setUpImg({ name: e.target.files[0].name, img: reader.result }));
        reader.readAsDataURL(e.target.files[0]);
      }
    }
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (props && props.location && props.location.state.user) {
      set_user(props.location.state.user)
    }
    else {
      axios_instance.get(`/user/${username}`).then((res) => {
        set_user(res.data);
        const parsed_dates = res.data.availability.map((date) => {
          const milliseconds = date.$date;
          const parsed_date = new Date(milliseconds)
          return parsed_date;
      })
        setDates(parsed_dates)
      })
    }
  }, [])

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
  }, [completedCrop]);

  const handleChange = (e) => {
    const updated_user = {
      ...user,
      [e.target.id]: e.target.value
    }
    set_user(updated_user)
  }

  const deleteUser = () => {
    history.push("/");
    axios_instance.delete(`/user/${username}/edit`)
      .then(() => {
        localStorage.clear()
        //You'd have to delete all their upcoming sessions too.
      })
      .catch((err) => {
        console.log(err)
      });

  }

  const handleDayClick = (day, { selected }) => {
    const arr = [...dates];
    if (selected) {
      const selectedIndex = arr.findIndex(selectedDay =>
        DateUtils.isSameDay(selectedDay, day)
      );
      arr.splice(selectedIndex, 1);
      setDates(arr);
    }
    else {
      setDates([...dates, day]);
    }
  }

  const parse_dates = (date_list) => {
    console.log(date_list)
    return date_list.map((date) => {
      return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
    })
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user)
    const config = {
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
      }
    }

    let parsed_availability = []
    if (dates.length !== 0) {
      parsed_availability = parse_dates(dates);
    }

    const edited_user = {
      email: user.email,
      full_name: user.full_name,
      username: user.username,
      biography: user.biography,
      roles: user.roles,
      availability: parsed_availability,
      us_phone_number: user.us_phone_number,
    }

    const bodyFormData = new FormData();


    if (completedCrop && !isCropping) {
      getCroppedImg(previewCanvasRef.current, upImg.name)
        .then((res) => {
          for (const [key, value] of Object.entries(edited_user)) {
            console.log(key)
            bodyFormData.append(key, value);
          }

          bodyFormData.append("profile_picture", res, upImg.name);
          
          axios_instance.post(`/user/${username}/edit`, bodyFormData, config)
            .then(function (res) {
              if (jwt.username == username) {
                localStorage.setItem("token", res.data.access_token)
              }
              history.push("/");
              window.location.reload(true)
            })
            .catch(function (error) {
              console.log(error);
            });
        })
    }
    else {

      for (const [key, value] of Object.entries(edited_user)) {
        console.log(key)
        bodyFormData.append(key, value);
      }
      axios_instance.post(`/user/${username}/edit`, bodyFormData, config)
        .then(function (res) {
          if (jwt.username == username) {
            localStorage.setItem("token", res.data.access_token)
          }
          //history.push("/");
          //h window.location.reload(true)
        })
        .catch(function (error) {
          console.log(error);
        });

    }


  }

  const getCroppedImg = (canvas, fileName) => {
    if(!completedCrop || !canvas){
      return;
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            blob.name = fileName;
            resolve(blob);
          }
          else {
            reject("Error making img blob")
          }
        },
        "image/png",
        1
      );
    });
  }

  return (
    <div >
      <h1>Edit</h1>
      <Form className="form-comp" id="edit-form" onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" value={user.email || ' '} onChange={handleChange} />
        </Form.Group>

        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" value={user.username || ' '} onChange={handleChange} />
        </Form.Group>

        <Form.Group controlId="us_phone_number">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" value={user.us_phone_number || ''} onChange={handleChange} />
        </Form.Group>

        <Form.Group controlId="biography">
          <Form.Label>Tell us about yourself!</Form.Label>
          <Form.Control as="textarea" rows={3} value={user.biography || ' '} onChange={handleChange} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Profile Picture</Form.Label>
          <input accept=".jpg,.png,.jpeg" type="file" name="profile_picture" onChange={onSelectFile} />
          <ReactCrop
            src={upImg.img}
            onImageLoaded={onLoad}
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            disabled={!isCropping}
          />
          <canvas
            ref={previewCanvasRef}
            style={{
              width: Math.round(completedCrop?.width ?? 0),
              height: Math.round(completedCrop?.height ?? 0)
            }}
          />
          <div>{isCropping && <Button onClick={() => { setIsCropping(!isCropping) }}>Crop</Button>}</div>
        </Form.Group>

        <Form.Group controlId="role">
          <Form.Check
            inline
            value="tutor"
            name="roles"
            label="Tutor"
            type="radio"
            id="roles"
            onClick={handleChange}
          />
          <Form.Check
            inline
            value="student"
            name="roles"
            label="Student"
            type="radio"
            id="roles"
            onClick={handleChange}
          />

          <Form.Check
            inline
            value="student,tutor"
            name="roles"
            label="Both"
            type="radio"
            id="roles"
            onClick={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="availability">
          <Form.Label>Availability</Form.Label>
          <DayPicker
            className="calendar"
            format="MM/DD/YYYY"
            name="availability"
            onDayClick={handleDayClick}
            selectedDays={dates}
            disabledDays={{ before: new Date() }}
          />

        </Form.Group>

        <Form.Group>
          <a className="delete-link" onClick={deleteUser}>Delete</a>
        </Form.Group>
        <Form.Group>
          <span>Forgot password? Click<a href="/reset_password"> Here</a></span>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>);
}

export default EditUser;

