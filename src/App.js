
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

// firebase.initializeApp(firebaseConfig)
// aita replace kore nicher ta likhsi

if(firebase.apps.length == 0){
  firebase.initializeApp(firebaseConfig);
  }
  // othoba aita use korbo

  // if(!firebase.apps.length){
  //   firebase.initializeApp(firebaseConfig);
  //   }

function App() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const [newUser,setNewuser]=useState(false)
  const[user,setUser]=useState({
    isSingedIn:false,
    name:'',
    password:'',
    email:'',
    photo:'',
    error:'',
    success:false
  }) 
  const handleSingIn=()=>{
    firebase.auth()
    .signInWithPopup(provider)
    .then((res) =>{
      // console.log(res.user)
      const{displayName,email,photoURL}=res.user
      const singdInUser={
        isSingedIn:true,
        name:displayName,
        email:email,
        photo:photoURL

      }
      setUser(singdInUser);
      console.log(displayName,email,photoURL)
    })
    .catch(error =>{
      console.log(error);
      console.log(error.message);
    })
  }
   const handleSingOut= () =>{
  firebase.auth().signOut().then(() => {
    const singdOutUser={
      isSingedIn:'',
      name:'',
      email:'',
      photo:''
    }
    setUser(singdOutUser)
 }).catch((error) => {
   console.log(error)
 });
}
  
const handleChange =(even) =>{
  let isFieldValid=true
   if( even.target.name==='email'){
     isFieldValid =/\S+@\S+\.\S+/.test(even.target.value)
    
   }
   if(even.target.name==='password'){
     const passWordValid= even.target.value.length > 6
     const passwordHassNumber= /(?=.*\d)/.test(even.target.value)
     console.log("pass",passwordHassNumber)
     isFieldValid= passWordValid && passwordHassNumber
     
    
   }
   if(isFieldValid){
     const newUserInfo={...user}
     newUserInfo[even.target.name]=even.target.value;
     setUser(newUserInfo);
   }
}

const handleSubmit =(event) =>{
   if(newUser && user.email && user.password){
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then((userCredential) => {
      var users = userCredential.user;
      const userInfo={...user}
      userInfo.error='';
      userInfo.success=true;
      setUser(userInfo)
      userNameUpdate(user.name)
      
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      const userInfo={...user}
      userInfo.error=error.message;
      userInfo.success=false;
      setUser(userInfo)
     
    });
   
   }
   if( !newUser && user.email && user.password){
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then((userCredential) => {
      var users = userCredential.user;
      const userInfo={...user}
      userInfo.error='';
      userInfo.success=true;
      setUser(userInfo)
      console.log("displayuser",users)
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      const userInfo={...user}
      userInfo.error=error.message;
      userInfo.success=false;
      setUser(userInfo)
    });
   }
   event.preventDefault();
}
const userNameUpdate = name =>{

  var user = firebase.auth().currentUser;

user.updateProfile({
  displayName: name

}).then(function() {
  console.log("name update successfully")
}).catch(function(error) {
  console.log(error)
});
}
const handleFbSingIn= ()=> {
  firebase
  .auth()
  .signInWithPopup(fbProvider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
   
    var credential = result.credential;

    // The signed-in user info.
    var user = result.user;
    console.log(user)
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
  });

}

  return (
    <div className="App">
      {
        user.isSingedIn ? <button onClick={handleSingOut}>Sing out</button>:
        <button onClick={handleSingIn}>Sing in</button>
      }

      <br/>
      <button onClick={handleFbSingIn}>login using facebook</button>
      {
        user.isSingedIn && <div>
          <p>{user.name}</p>
          <p>{user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
      <br/><br/>
           <input type="checkbox" onChange={()=>setNewuser(!newUser)} name="newUser" id=""/>
           <label htmlFor="newUser">New User Sign up</label>

      <form onSubmit={handleSubmit}>
        {
          newUser && <input type="text" name="name" onBlur={handleChange} placeholder="your name" id=""/>
        }
        <br/> 
        <input type="email" name="email" onBlur={handleChange} id="" placeholder="Your Email" required/>
        <br/>
        <input type="password" name="password"  onBlur={handleChange} id="" placeholder="Your Password" required/>
        <br/>
        <input type="submit"/>
      </form>
        <p style={{color:'red'}}> {user.error}</p>
        {
          user.success &&  <p style={{color:'green'}}> user { newUser ? 'created' : 'logged in'} successfully</p>
        }

    </div>
  );
}

export default App;
