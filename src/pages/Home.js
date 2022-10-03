import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from 'react-bootstrap/Spinner';

const Home = ()=>{
    const [listsProducts, setListProducts] = useState([]);
    const [limit, setLimit] = useState(6);
    const [offset, setOffset] = useState(3);
    const [isEmpty, setIsEmpty] = useState(false);
    const [isLoading, setLoading] = useState(true);
    
    window.onscroll = () => {
        console.log("doc offset",document.documentElement.offsetHeight);
        console.log("scroll",document.documentElement.scrollTop);
        if (window.innerHeight + document.documentElement.scrollTop > document.documentElement.offsetHeight && listsProducts.length) {
            var config = {
                method: 'get',
                url: `${process.env.REACT_APP_API_URL}/show-product/${offset}`,
                headers: { 
                  'x-api-key': 'guest'
                }
            };
                axios(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data.data.length));
                    var listing = listsProducts.concat(response.data.data);
                    setListProducts(listing)
                    if(response.data.data.length)
                    {
                        setIsEmpty(false);
                        setOffset(offset+3);
                        console.log(offset);
                    }else{
                        setIsEmpty(true);
                    }
                    setLoading(false);
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(()=>{
                    setLoading(false);
                });
        }
    }

    useEffect(()=>{
        
        var config = {
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/products/${limit}`,
            headers: { 
              'x-api-key': 'guest'
            }
        };
        setLoading(true);  
        axios(config)
          .then(function (response) {
            setListProducts(response.data.data)
            if(! response.data.data.length)
            {
                setIsEmpty(false);
            }else{
                setIsEmpty(true);
            }
            setLoading(false);
          })
          .catch(function (error) {
            console.log(error);
        })
        .finally(()=>{
            setLoading(false);
        });   
    },[limit]);

    return (
        <div className="row">{ 
            isLoading ? 
                <div className="text-center" style={{padding:50}}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div> :
                        listsProducts.map((value, index)=>(
                            <div className="col-sm-4 p-5" key={index} >
                                <div className="card col-sm-12">
                                    <div className="card-body col-sm-12">
                                        <div className="col-sm-12" style={{height:"25em"}}>
                                            <img className="card-img-top" src={ value.images ? `${process.env.REACT_APP_API_URL}/${value.images}` : "./../default.jpeg"} style={{width:"100%",height:"100%"}} alt="Card image cap"/>
                                        </div>
                                        <h4 className="card-text text-center">{value.name}</h4>
                                        <p className="card-text text-center">{value.description}</p>
                                        <p className="card-text text-center">Rp. {value.price}</p>
                                        <p className="card-text text-center">({value.id})</p>
                                        <p className="card-text text-center">
                                            <a href="#" className="btn btn-primary">edit</a>
                                        </p>      
                                    </div>
                                </div>
                            </div>
            ))
         }</div>
    );
}

export default Home;