import React, {useEffect, useState} from 'react';
import {Link, useHistory} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import './styles/listUsers.scss';

function Statistics(props) {
    let history = useHistory();
    const dispatch = useDispatch();
    const {total, quantity} = useSelector(state => state.sqlite);
    const host = window.location.origin;
    const [page, setPage] = useState({
        number: 1, start: 0, end: 5
    });

    useEffect(() => {
        fetch(host + '/api/total/'+page.number)
            .then(res => res.json())
            .then(json => dispatch({type: 'init total', payload: json}))
            .catch(err => console.log(err));
    }, [page.number]);




    function getPage(start, end) {
        return quantity.slice(start, end)
            .map(pg => (<li onClick={() => setPage({...page, number: pg})}
                            style={{backgroundColor: (page.number === pg) && `rgba(204, 35, 31, 0.47)`}}>
                <span>{pg}</span></li>));

    }

    function minusPage() {
        if (page.start !== 0) {
            setPage({...page, start: page.start - 5, end: page.end - 5,
            number:page.end-9});
        } else {
            return false;
        }
    }

    function addPage() {
        if (page.end !== quantity.length) {
            setPage({...page, start: page.start + 5, end: page.end + 5,
            number:page.end+1});
        } else {
            return false;
        }
    }

    let row = () => {
        if (total.length > 0) {
            return total.map((user, index) => (
                <tr className='listUsers-table_tr' key={user.id} onClick={() => {
                    dispatch({type: 'name', payload: user.first_name});
                    history.push(`/user-page/${user.id}`);
                }}>

                    <td>{user.id}</td>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.email}</td>
                    <td>{user.gender}</td>
                    <td>{user.ip_address}</td>
                    <td>{user.sumViews}</td>
                    <td>{user.sumClicks}</td>
                </tr>
            ));
        } else {
            return '';
        }
    };

    return (
        <div className='listUsers'>
            <h1>Users statistics</h1>
            <ul className='listUsers-ul'>
                <li><Link to='/'>Main Page</Link></li>
                <li><Link to='/statistics'>User Statistic</Link></li>
            </ul>


            <h1>List Users</h1>
            <table className='listUsers-table'>
                <thead>
                <tr>
                    <th>id</th>
                    <th>First Nam</th>
                    <th>Last name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>IP address</th>
                    <th>Total clicks</th>
                    <th>Total page views</th>
                </tr>
                </thead>
                <tbody>
                {row()}
                </tbody>
            </table>
            <ul className='listUsers-ul_page'>
                <li onClick={minusPage}><span>&#11164;</span></li>
                {getPage(page.start, page.end)}
                <li onClick={addPage}><span>&#11166;</span></li>
            </ul>
        </div>

    );
}

export default Statistics;




