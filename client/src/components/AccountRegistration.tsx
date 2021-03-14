import { useState } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom';
import { useHistory } from 'react-router-dom';

function AccountRegistration() {
  const [loading, setloading] = useState(false);
  const [password, setPassword] = useState('');
  const { user_id }: { user_id: string } = useParams();
  const history = useHistory();

  var submit = (e: any) => {
    e.preventDefault();
    setloading(true);
    axios
      .put('http://localhost:3001/api/user/register/' + user_id, {
        password: password,
      })
      .then((res) => {
        if (res.data.saved) history.replace('/');
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
      className='h-auto grid-rows-1 shadow-xl'
    >
      <h2
        style={{ textAlign: 'center', marginBottom: '30px' }}
        className='text-4xl '
      >
        Please register your password
      </h2>
      <form id='form' onSubmit={(e) => submit(e)}>
        <label htmlFor='password'>Password</label>
        <br />
        <input
          className='loginFormInput'
          type='password'
          name='password'
          onChange={(e: any) => setPassword(e.target.value)}
        />
        <br />
        <button
          className='submit'
          type='submit'
          disabled={loading}
          onClick={submit}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default AccountRegistration;
