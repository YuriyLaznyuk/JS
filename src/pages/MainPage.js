import React, {useEffect} from 'react';
import {Link,} from 'react-router-dom';
import './styles/mainPage.scss';
import {useSelector, useDispatch} from "react-redux";

function MainPage(props) {
    const host = window.location.origin;
    const dispatch = useDispatch();

    function navPages(col, quantity) {
        const numberPage = [];
        const quantityPage = Math.ceil(quantity / col);
        for (let i = 1; i < quantityPage + 1; i++) {
            numberPage.push(i);
        }
        return numberPage;
    }



    useEffect(() => {
        fetch(host + '/api/users')
            .then(res => res.json())
            .then(json => {
                dispatch({type: 'init users',
                    payload: navPages(50,json.message)});
                console.log(json.message);
            })
            .catch(err => console.log(err));
    }, []);


    return (
        <div className='mainPage'>

            <Link to="/statistics">STATISTICS</Link>
            <h1>Main Page</h1>
            <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Accusamus at cumque distinctio dolor dolore enim esse fuga harum
                illum ipsum nisi, quasi qui, quidem quisquam quod sed sit tempora vitae?
            </div>

        </div>
    );
}

export default MainPage;