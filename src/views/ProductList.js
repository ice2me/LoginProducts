import React, {useEffect, useState} from 'react';
import {useProductListMutation, useSortProductsMutation} from "../redux/services/authApi";
import {useDispatch, useSelector} from "react-redux";
import {logout, setProduct} from "../redux/slices/userSlice";
import {Button, Card} from "react-bootstrap";
import PaginationCustomComponent from "../components/PaginationCustomComponent";
import Loader from "../components/Loader";
import {useNavigate} from "react-router-dom";

const ProductList = () => {
    const [dateFrom, setDateFrom] = useState('2020-12-01')
    const [dateTo, setDateTo] = useState('2020-12-29')
    const [priceFrom, setPriceFrom] = useState(Number(0))
    const [priceTo, setPriceTo] = useState(Number(0))
    const [title, setTitle] = useState('')

    const [todos, setTodos] = useState(localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : []);

    const [productList, {isLoader}] = useProductListMutation();
    const [sortProducts, {isLoader: isSortProductsLoader}] = useSortProductsMutation();

    const {products, profileInfo} = useSelector((state) => state.userStore);
    const [productsList, setProductsList] = useState(products)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);


    const getProductsList = async () => {
        if (todos.date_from || todos.date_to || todos.title || todos.price_from || todos.price_to) {
            const dateLine = `from=${todos.date_from}&to=${todos.date_to}`
            const priceLine = `&price_from=${todos.price_from}&price_to=${todos.price_to}`
            const titleLine = `&title=${todos.title}`
            const req = await sortProducts(`${dateLine}${priceLine}${titleLine}`)
            dispatch(setProduct(req?.data.data))
            setProductsList(req?.data.data)
            setLastPage(req?.data.last_page)
        } else {
            const data = await productList(currentPage)
            dispatch(setProduct(data.data.data))
            setProductsList(data.data.data)
            setLastPage(data.data.last_page)
        }
    }
    useEffect(() => {
        if ((priceFrom || priceTo || title) === '') {
            getProductsList()
        }
    }, [currentPage])

    const goToBack = () => {
        dispatch(logout())
        navigate('/')
    }
    const setTodosWithSave = (newTodos) => {
        setTodos(newTodos);
        localStorage.setItem('todos', JSON.stringify(newTodos))
    }

    const sortProductsHandler = async () => {
        const dateLine = (dateFrom || dateTo) ? `from=${dateFrom}&to=${dateTo}` : ''
        const priceLine = (priceFrom || priceTo) ? `&price_from=${priceFrom}&price_to=${priceTo}` : ''
        const titleLine = title ? `&title=${title}` : ''
        const req = await sortProducts(`${dateLine}${priceLine}${titleLine}`)
        setProductsList(req?.data.data)
        setLastPage(req?.data.last_page)
        setTodosWithSave({date_from: dateFrom, date_to: dateTo, price_from: priceFrom, price_to: priceTo, title})
    }

    const clearSortList = async () => {
        setTodosWithSave([])
        const data = await productList(currentPage)
        dispatch(setProduct(data.data.data))
        setProductsList(data.data.data)
        setLastPage(data.data.last_page)
        setDateFrom('2020-12-01')
        setDateTo('2020-12-29')
        setPriceFrom(0)
        setPriceTo(0)
        setTitle('')
    }

    return (
        <>
            <div className='position-absolute end-0 top-0'>
                <Card style={{width: '10rem'}}>
                    <Card.Img variant="top" src={profileInfo.profile_image}/>
                    <Card.Body>
                        <Card.Title>{profileInfo.name}</Card.Title>
                        <Card.Text>
                            {profileInfo.email}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
            <div className='w-100 d-flex align-items-start justify-content-center position-relative py-5'>
                <Button
                    className='position-absolute start-0'
                    onClick={goToBack}
                >
                    Back
                </Button>
                <h1>Products</h1>
            </div>
            <div className="w-100 d-flex ">
                <div className='d-flex flex-column align-items-end justify-content-start px-3'>
                    <label htmlFor="from">
                        <span>date from</span>
                        <input
                            type="date"
                            name='date_from'
                            defaultValue={todos && todos.date_from}
                            onChange={(e) => setDateFrom(e.target.value)}
                        />
                    </label>
                    <label htmlFor="to" className="mt-2">
                        <span>date to</span>
                        <input
                            type="date"
                            name='to'
                            defaultValue={todos && todos.date_to}
                            onChange={(e) => setDateTo(e.target.value)}
                        />
                    </label>
                </div>
                <div className='d-flex flex-column align-items-start justify-content-start'>
                    <label htmlFor="price_from">
                        <input
                            type="number"
                            name='price_from'
                            placeholder='price from'
                            defaultValue={todos && todos.price_from}
                            onChange={(e) => setPriceFrom(e.target.value)}
                        />
                    </label>
                    <label htmlFor="price_to" className="mt-2">
                        <input
                            type="nameber"
                            name='price_to'
                            placeholder='price to'
                            defaultValue={todos && todos.price_to}
                            onChange={(e) => setPriceTo(e.target.value)}
                        />
                    </label>
                </div>

                <label htmlFor="price_to" className="mx-2">
                    <input
                        type="text"
                        name='title'
                        placeholder='name'
                        defaultValue={todos && todos.title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>
                <div className='d-flex flex-column align-items-start justify-content-start'>
                    <Button
                        onClick={sortProductsHandler}
                    >
                        Sort
                    </Button>
                    <Button
                        className='mt-2'
                        onClick={clearSortList}
                    >
                        Clear
                    </Button>
                </div>

            </div>
            {isLoader || isSortProductsLoader
                ? <Loader/>
                : <div className="d-flex align-items-start justify-content-center flex-wrap">
                    {productsList?.map(item => (
                        <Card border="danger" style={{width: '18rem', margin: '8px'}} key={item.id}>
                            <Card.Img variant="top" src={item.thumbnail}/>
                            <Card.Header>
                                {item.title}
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    {item.price}
                                </Card.Title>
                                <Card.Text>
                                    {item.body}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </div>}
            <PaginationCustomComponent
                currentPage={currentPage}
                lastPage={lastPage}
                setCurrentPage={setCurrentPage}
                alwaysShown={true}
            />
        </>
    );
};

export default ProductList;