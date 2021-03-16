import axios from 'axios';
import { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { login, selectUser } from '../slices/user';
import { useHistory } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  var submit = (e: any) => {
    e.preventDefault();
    if (!email || !password) return setError('Fill in the fields');
    setLoading(true);
    axios({
      url: 'http://localhost:3001/api/user/login',
      method: 'POST',
      data: { email: email, password: password },
    }).then((res) => {
      let { user } = res.data;
      if (user) {
        dispatch(
          login({
            email: user.email,
            role: user.role,
            isLogged: true,
          }),
        );
        window.localStorage.setItem('authorization', res.headers.authtoken);
        history.push('/admin/student?page=1');
      } else {
        if (res.data.exists) {
          setError('Wrong password');
        } else {
          setError('User does not exist');
        }
      }
      setLoading(false);
    });
  };

  return (
    <div
      style={{
        border: '1px solid #ccc',
        width: '33%',
        minWidth: '300px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '50px',
        fontSize: '20px',
      }}
      className="h-auto grid-rows-1 shadow-xl forms"
    >
      <h2
        style={{ textAlign: 'center', marginBottom: '30px' }}
        className="text-4xl "
      >
        Login
      </h2>
      <form id="form" onSubmit={(e) => submit(e)}>
        <label htmlFor="email">Email</label>
        <br />
        <input
          className="loginFormInput"
          type="text"
          name="email"
          onChange={(e: any) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="password">Password</label>
        <br />
        <input
          className="loginFormInput"
          type="password"
          name="password"
          onChange={(e: any) => setPassword(e.target.value)}
        />
        <br />
        <button className="submit" type="submit" disabled={isLoading}>
          Login
        </button>
      </form>
      <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
    </div>
  );
}

export default connect()(LoginForm);
