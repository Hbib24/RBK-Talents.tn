import { useState } from 'react';
import axios from 'axios';

const CompanyModal = (props: any) => {
  const [email, setemail] = useState('');
  const [name, setname] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();

    axios
      .post('http://localhost:3001/api/user/new', {
        email: email,
        username: name,
      })
      .then((res) => {
        props.setCompanies((arr: any) => [...arr, res.data]);
        props.setModal(false);
      });
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className='px-4 py-5 bg-white space-y-6 sm:p-6'>
        <h1 className='text-3xl font-semibold'>Add company</h1>

        <div className='border-t border-gray-200'></div>

        <div className='grid grid-cols-3 gap-6'>
          <div className='col-span-3 sm:col-span-2'>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700'
            >
              Name
            </label>
            <div className='mt-1 flex rounded-md shadow-sm'>
              <input
                required
                onChange={(e) => setname(e.target.value)}
                type='name'
                name='name'
                className='focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300'
              />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-3 gap-6'>
          <div className='col-span-3 sm:col-span-2'>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email
            </label>
            <div className='mt-1 flex rounded-md shadow-sm'>
              <input
                required
                onChange={(e) => setemail(e.target.value)}
                type='email'
                name='email'
                className='focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300'
              />
            </div>
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Photo
          </label>
          <div className='mt-1 flex items-center'>
            <span className='inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100'>
              <svg
                className='h-full w-full text-gray-300'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
              </svg>
            </span>
            <button
              type='button'
              className='ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              Change
            </button>
          </div>
        </div>
        <div className='text-gray-500'>
          An email will be sent to the company in order for them to register
          their account.
        </div>
      </div>

      <div className='px-4 py-3 bg-gray-50 text-right sm:px-6 rounded-md'>
        <button
          type='submit'
          className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default CompanyModal;
