import './App.css';
import {useSelector} from "react-redux";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "./views/Login";
import ProductList from "./views/ProductList";

function App() {
    const {userStore: {token}} = useSelector((state) => ({userStore: state.userStore}));
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/*">
                        <Route index element={<Login/>}/>
                        <Route path="products" element={<ProductList/>}/>
                        <Route path="login" element={<Login/>}/>
                        <Route path='*' element={<Navigate replace to='/login' />}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
