import React, {useCallback, useEffect} from 'react';
import {Formik} from "formik";
import * as yup from "yup";
import {Button, Form} from "react-bootstrap";
import {useLoginMutation, useUserInfoMutation} from "../redux/services/authApi";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {logout, setProfileInfo, setToken, setUser} from "../redux/slices/userSlice";
import Loader from "../components/Loader";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [login, {isError, error: errorLogin, isLoading: isLoginLoading}] = useLoginMutation();
    const [userInfo] = useUserInfoMutation();

    const schema = yup.object().shape({
        email: yup
            .string()
            .trim()
            .required("Email is a required field")
            .email("Email must be a valid email")
            .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Email must be a valid email"),
        password: yup
            .string()
            .required("Password is a required field")
            .matches(/^[a-zA-Z0-9!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?]{6,}$/, "Must contain at least 6 characters"),
    });

    const handleSubmit = useCallback(async (values, {setErrors}) => {
            try {
                const {data, error} = await login({email: values.email, password: values.password});
                dispatch(setToken(data.access_token))
                dispatch(setUser(data.user))
                navigate('/products')
                const info = await userInfo()
                dispatch(setProfileInfo(info.data))
                if (error || errorLogin) {
                    setErrors(error);
                    return;
                }
            } catch (e) {
                console.log("Unhandled login error :", e);
                navigate('/')
            }
        },
        [login, isError, errorLogin]
    );

    useEffect(() => {
        dispatch(logout())
    }, [])

    return (
        <div className="bg-white rounded-1 p-3 p-lg-32">
            <Formik
                validateOnChange
                initialValues={{email: "", password: ""}}
                validationSchema={schema}
                onSubmit={handleSubmit}
            >
                {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      isValid,
                      handleSubmit,
                      dirty
                  }) => (
                    <Form className="form" onSubmit={handleSubmit}>
                        <Form.Group className="position-relative mb-4">
                            <Form.Label>
                                Your mail
                            </Form.Label>
                            <Form.Control
                                className={`${touched?.email ? "is-touch " : ""} ${
                                    errors?.email && touched?.email ? " is-invalid" : ""
                                }`}
                                type="text"
                                name="email"
                                tabIndex="1"
                                value={values.email}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            {errors?.email && touched?.email && (
                                <Form.Control.Feedback type="invalid">
                                    {errors?.email}
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>

                        <Form.Group className="position-relative mb-4">
                            <Form.Label>
                                Your password
                            </Form.Label>
                            <Form.Control
                                className={`${touched?.password ? "is-touch " : ""} ${
                                    errors?.password && touched?.password ? " is-invalid" : ""
                                }`}
                                type="password"
                                name="password"
                                tabIndex="1"
                                value={values.password}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            {errors?.password && touched?.password && (
                                <Form.Control.Feedback type="invalid">
                                    {errors?.password}
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>
                        <Button
                            variant="primary"
                            tabIndex="3"
                            type={"submit"}
                            size="lg"
                            className="w-100"
                            disabled={!(isValid && dirty) || isLoginLoading}
                        >
                            Enter {isLoginLoading && <Loader/>}
                        </Button>
                        { isError && errorLogin && (
                            <p className="text-danger position-absolute text-center">
                                Internal server error. Please try again later
                            </p>
                        )}
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Login;