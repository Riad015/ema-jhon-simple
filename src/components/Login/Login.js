//arekta file niye sajai ne 43-6
import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, FacebookAuthProvider} from "firebase/auth";
import firebaseConfig from './firebase.config';
import { useContext } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';

const app = initializeApp(firebaseConfig);

function Login() {

  const [user, setUser] = useState({
    isSignedIn: false,
    name:'',
    email:'',
    photo:'',
    password:'',
    isValid:false,
    error:'',
    existingUser: false
  })

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };


  const googleProvider = new GoogleAuthProvider();
  const fbProvider = new FacebookAuthProvider();

  const handleGoogleSignIn = ()=>{
      const auth = getAuth();
      signInWithPopup(auth, googleProvider)
      .then((result) =>{
        const {displayName, email, photoURL} = result.user;
        const signInUser = {
          isSignedIn:true,
          name:displayName,
          email:email,
          photo:photoURL
        }
        setUser(signInUser);
        console.log(result);
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
    
  }

  const handlefbSignIn = ()=>{
    const auth = getAuth();
    signInWithPopup(auth, fbProvider)
    .then((result) => {
       const user = result.user;
       const credential = FacebookAuthProvider.credentialFromResult(result);
       const accessToken = credential.accessToken;
       console.log('Fb user after sign in',user);
    })
   .catch((error) => {
       const errorCode = error.code;
       const errorMessage = error.message;
       const email = error.customData.email;
       const credential = FacebookAuthProvider.credentialFromError(error);
  });

  }
  const handleSignOut = () =>{
      const auth = getAuth();
      signOut(auth).then(() => {
       const signOutUser = {
        isSignedIn:false,
        name: '',
        photo:'',
        email:''
       }
       setUser(signOutUser);
      }).catch((error) => {

      });
  }

  const isValidEmail = email => /^\S+@\S+\.\S+$/.test(email);
  const switchFrom = e =>{
    const createdUser = {...user};
    createdUser.existingUser = e.target.checked;
    setUser(createdUser);
  }

  const handleChange = e =>{
      const newUserInfo = {
        ...user
      };

      let isValid = true;
      if(e.target.name === 'email'){
        isValid = (isValidEmail(e.target.value));
      }
      if(e.target.name === 'password'){
        isValid = e.target.value.length > 8;
      }
      newUserInfo[e.target.name] = e.target.value;
      newUserInfo.isValid = isValid;
      setUser(newUserInfo);
  }
  const createAccount =(event)=>{
    if(user.isValid){
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
              const user = userCredential.user;
              const createdUser = {...user};
              createdUser.isSignedIn = true;
              createdUser.error = '';
              setUser(createdUser);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const createdUser = {...user};
            createdUser.isSignedIn = false;
            createdUser.error = errorMessage;
            setUser(createdUser);
        });
    }
    else{
      console.log('not valid', user);
    }
    event.preventDefault();
    event.target.reset();
  }

  const signInUser = event =>{
    if(user.isValid){
      const auth = getAuth();
      signInWithEmailAndPassword(auth, user.email, user.password)
      .then((userCredential) => {
            const user = userCredential.user;
            const createdUser = {...user};
            createdUser.isSignedIn = true;
            createdUser.error = '';
            setUser(createdUser);
            setLoggedInUser(createdUser);
            history.replace(from);
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const createdUser = {...user};
          createdUser.isSignedIn = false;
          createdUser.error = errorMessage;
          setUser(createdUser);
      });
  }
    event.preventDefault();
    event.target.reset();
  }

  return (
    <div style={{textAlign: 'center'}}>
        {
          user.isSignedIn && <div>
            <img src={user.photo} alt="" />
            <p>Welcome, {user.name}</p>
            <p>Your Email : {user.email}</p>
          </div>
        }
        <br />
        {
          user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
          <button onClick={handleGoogleSignIn}>Sign in</button>
        }
        <br />
        <button onClick={handlefbSignIn}>Facebook Sign In</button>
        <h1>Password Authentication Section</h1>

        <input type="checkbox" name="switchForm" onChange={switchFrom} id="switchForm"/>
        <label htmlFor="switchForm"> Returning User</label>

        <form style={{display:user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
            <input onBlur={handleChange} type="text" name='email' placeholder='Type your Email here' required/>
            <br />
            <input onBlur={handleChange} type="text" name='password' placeholder='Type your password here' required/>
            <br />
            <input type="submit" value="Sign In" />
        </form>
        <br />
        <form style={{display:user.existingUser ? 'none' : 'block'}} onSubmit={createAccount}>
            <input onBlur={handleChange} type="text" name='name' placeholder='Type your Name here' required/>
            <br />
            <input onBlur={handleChange} type="text" name='email' placeholder='Type your Email here' required/>
            <br />
            <input onBlur={handleChange} type="text" name='password' placeholder='Type your password here' required/>
            <br />
            <input type="submit" value="Create Account" />
        </form>
        {
          user.error && <p>{user.error}</p>
        }
    </div>
  );
}

export default Login;
