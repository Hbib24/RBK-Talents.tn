import { useState, useEffect } from 'react';
import axios from 'axios';
import loader from '../loader.gif';
import { connect, useSelector } from 'react-redux';
import {
  useHistory,
  useParams,
  useLocation,
  Link,
  Redirect,
} from 'react-router-dom';
import Modal from 'react-modal';
import StudentModal from './modals/StudentModal';
import StudentEditModal from './modals/StudentEditModal';
import StudentResume from './modals/StudentResume';
import { login, selectUser } from '../slices/user';
import { useDispatch } from 'react-redux';

interface IStudents {
  _id: String;
  firstName: String;
  lastName: String;
  email: String;
  resume: String;
  cohort: String;
  imageUrl: String;
}

const StudentList = () => {
  const [resume, setresume] = useState(false);
  const [students, setStudents] = useState<IStudents[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [modal, setModal] = useState(false);
  const [deletemodal, setdeletemodal] = useState(false);
  const [edit, setedit] = useState(false);
  const [selected, setselected] = useState({ _id: '' });
  const [searchload, setsearchload] = useState(false);

  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const query = new URLSearchParams(useLocation().search);
  const page = Number(query.get('page'));
  const searchQuery = query.get('search');
  const currentUser = useSelector(selectUser);
  const authorization = window.localStorage.getItem('authorization');

  useEffect(() => {
    if (!authorization) {
      history.replace('/');
      return;
    } else {
      axios
        .post(
          '/api/user/login',
          {},
          { headers: { authorization: authorization } },
        )
        .then((res: any) => {
          let { user } = res.data;
          if (user) {
            dispatch(
              login({
                email: user.email,
                role: user.role,
                isLogged: true,
              }),
            );
          } else {
            history.replace('/');
            return;
          }
        });
    }

    if (searchQuery) {
      history.replace('/admin/student?page=1');
      axios.get('http://localhost:3001/api/student/1').then((res: any) => {
        setStudents(res.data.items);
        setCount(res.data.count);
        setLoading(false);
      });
    } else {
      history.replace('/admin/student?page=' + page);
      axios
        .get('http://localhost:3001/api/student/' + page)
        .then((res: any) => {
          setStudents(res.data.items);
          setCount(res.data.count);
          setLoading(false);
        });
    }
  }, []);

  const deleteStudent = () => {
    axios
      .delete(`http://localhost:3001/api/student/delete/${selected._id}`)
      .then(() => {
        if (searchQuery) {
          axios
            .get(
              'http://localhost:3001/api/student/' +
                page +
                '?search=' +
                searchQuery,
            )
            .then((res: any) => {
              setStudents(res.data.items);
              setCount(res.data.count);
              setdeletemodal(false);
            });
        } else {
          axios
            .get('http://localhost:3001/api/student/' + page)
            .then((res: any) => {
              setStudents(res.data.items);
              setCount(res.data.count);
              setdeletemodal(false);
            });
        }
      });
  };

  const next = () => {
    if (page * 8 >= count) return;
    setLoading(true);

    if (searchQuery) {
      axios
        .get(
          'http://localhost:3001/api/student/' +
            (page + 1) +
            '?search=' +
            searchQuery,
        )
        .then((res: any) => {
          setStudents(res.data.items);
          setCount(res.data.count);
          history.replace(
            '/admin/student?page=' + (page + 1) + '&search=' + searchQuery,
          );
          setLoading(false);
        });
    } else {
      axios
        .get('http://localhost:3001/api/student/' + (page + 1))
        .then((res: any) => {
          setStudents(res.data.items);
          setCount(res.data.count);
          history.replace('/admin/student?page=' + (page + 1));
          setLoading(false);
        });
    }
  };

  const prev = () => {
    if (!(page - 1)) return;
    setLoading(true);

    if (searchQuery) {
      axios
        .get(
          'http://localhost:3001/api/student/' +
            (page - 1) +
            '?search=' +
            searchQuery,
        )
        .then((res: any) => {
          setStudents(res.data.items);
          setCount(res.data.count);
          history.replace(
            '/admin/student?page=' + (page - 1) + '&search=' + searchQuery,
          );
          setLoading(false);
        });
    } else {
      axios
        .get('http://localhost:3001/api/student/' + (page - 1))
        .then((res: any) => {
          setStudents(res.data.items);
          setCount(res.data.count);
          history.replace('/admin/student?page=' + (page - 1));
          setLoading(false);
        });
    }
  };

  const goToPage = (n: number) => {
    if (page == n) return;
    setLoading(true);
    axios.get('http://localhost:3001/api/student/' + n).then((res: any) => {
      setStudents(res.data.items);
      setCount(res.data.count);
      history.replace('/admin/student?page=' + n);
      setLoading(false);
    });
  };

  const pagination = () => {
    let pages = [];
    for (var i = 1; i < count / 8 + 1; i++) {
      pages.push(i);
    }

    return pages.map((n) => (
      <a
        onClick={() => goToPage(n)}
        key={n}
        className="cursor-pointer relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        {n}
      </a>
    ));
  };

  const search = (query: string) => {
    setsearchload(true);
    axios
      .get('http://localhost:3001/api/student/1?search=' + query)
      .then((res) => {
        history.replace('/admin/student?page=1&search=' + query);
        setStudents(res.data.items);
        setCount(res.data.count);
        setsearchload(false);
      });
  };

  const renderStudents = () => {
    if (searchload) {
      return (
        <img
          style={{
            width: '150',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          src={loader}
          alt="loader"
        />
      );
    } else {
      return (
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Resume
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cohort
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit/Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((ele: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={ele.imageUrl}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {ele.firstName} {ele.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {ele.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <a
                          className="hover:text-blue-500 cursor-pointer"
                          onClick={() => {
                            setselected(ele);
                            setresume(true);
                          }}
                        >
                          resume
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold">
                        {ele.cohort}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a
                        className="mx-8 text-indigo-600 hover:text-indigo-900 cursor-pointer"
                        onClick={() => {
                          setselected(ele);
                          setedit(true);
                        }}
                      >
                        Edit
                      </a>
                      <a
                        href="#"
                        className="text-red-500 hover:text-red-600 cursor-pointer"
                        onClick={() => {
                          setdeletemodal(true);
                          setselected(ele);
                        }}
                      >
                        Delete
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden cursor-pointer">
              <a
                onClick={prev}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 cursor-pointer"
              >
                Previous
              </a>
              <a
                onClick={next}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 cursor-pointer"
              >
                Next
              </a>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page
                  <span className="font-medium"> {page} </span>,
                  <span className="font-medium"> {count} </span>
                  results in total.
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <a
                    onClick={prev}
                    className="cursor-pointer relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only cursor-pointer">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  {pagination()}
                  <a
                    onClick={next}
                    className="cursor-pointer relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only cursor-pointer">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const customStyles = {
    content: {
      marginLeft: '33%',
      marginTop: '8%',
      border: '1px solid gray',
    },
  };

  const customStyles2 = {
    content: {
      marginLeft: '33%',
      marginTop: '13%',
      border: '1px solid gray',
    },
  };

  const customStyles3 = {
    content: {
      marginLeft: '32%',
      marginTop: '6%',
      border: '1px solid gray',
      height: '85%',
      width: '35%',
    },
  };

  if (loading) {
    return (
      <img
        style={{
          width: '150',
          marginLeft: ' auto',
          marginRight: 'auto',
          marginTop: '200px',
        }}
        src={loader}
        alt="loader"
      />
    );
  } else {
    return (
      <div id="main">
        <nav className="bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-8"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                    alt="Workflow"
                  />
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <a className="bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
                      Student List
                    </a>
                    <Link
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                      to="/admin/company"
                    >
                      Company List
                    </Link>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <button className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">View notifications</span>
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </button>

                  <div className="ml-3 relative">
                    <div>
                      <button
                        type="button"
                        className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                        id="user-menu"
                        aria-expanded="false"
                        aria-haspopup="true"
                      >
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                <button
                  type="button"
                  className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>

                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>

                  <svg
                    className="hidden h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a className="bg-gray-900 text-gray-300 block px-3 py-2 rounded-md text-base font-medium">
                Student List
              </a>

              <a
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                href="/admin/company"
              >
                Company List
              </a>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">
                    Tom Cook
                  </div>
                  <div className="text-sm font-medium leading-none text-gray-400">
                    tom@example.com
                  </div>
                </div>
                <button className="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <span className="sr-only">View notifications</span>
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  Your Profile
                </a>

                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  Settings
                </a>

                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  Sign out
                </a>
              </div>
            </div>
          </div>
        </nav>

        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Student</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <button
              onClick={() => setModal(true)}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              + Add student
            </button>
            <div
              className="flex rounded-full border-grey-light border"
              style={{ float: 'right' }}
            >
              <div>
                <span className="w-auto flex justify-end items-center text-grey p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    width="20"
                    color="gray"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
              <input
                className="w-full rounded mr-4 focus:outline-none"
                type="text"
                placeholder="Search..."
                onChange={(e) => search(e.target.value)}
              />
            </div>

            {/* ----------------------------------------------------------------------
               Modals

               --------------------------------------------------------------------
             ---------------------------------------------------------------------- */}

            <Modal
              isOpen={modal}
              onRequestClose={() => setModal(false)}
              style={customStyles}
              className="w-4/12 md:min-w-1/2 rounded-md"
            >
              <button
                onClick={() => setModal(false)}
                style={{ float: 'right' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <StudentModal
                selected={selected}
                setCount={setCount}
                setStudents={setStudents}
                setModal={setModal}
              />
            </Modal>

            <Modal
              isOpen={edit}
              onRequestClose={() => setedit(false)}
              style={customStyles}
              className="w-4/12 md:min-w-1/2 rounded-md"
            >
              <button onClick={() => setedit(false)} style={{ float: 'right' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <StudentEditModal
                setStudents={setStudents}
                selected={selected}
                setedit={setedit}
              />
            </Modal>

            <Modal
              isOpen={deletemodal}
              onRequestClose={() => setdeletemodal(false)}
              style={customStyles2}
              className="w-4/12 md:min-w-1/2 rounded-md"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Delete student
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this student, this
                        content will be permanently removed and connot be
                        undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={deleteStudent}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setdeletemodal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </Modal>

            <Modal
              isOpen={resume}
              onRequestClose={() => setresume(false)}
              style={customStyles3}
              className="w-4/12 md:min-w-1/2 rounded-md"
            >
              <StudentResume selected={selected} />
            </Modal>

            <div className="px-4 py-6 sm:px-0">
              <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  {renderStudents()}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
};

export default StudentList;
