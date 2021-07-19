import React, {useEffect, useState} from 'react';
import {Link, useHistory} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import './styles/statistics.scss';

function Statistics(props) {
    let history = useHistory();
    const dispatch = useDispatch();
    const {total, quantity} = useSelector(state => state.sqlite);
    const host = window.location.origin;
    const [page, setPage] = useState({
        number: 1, start: 0, end: 5, status: 'pending'
    });

    useEffect(() => {
        fetch(host + '/api/total/' + page.number)
            .then(res => res.json())
            .then(json => dispatch({type: 'init total', payload: json}))
            .catch(err => console.log(err));
    }, [page.number]);

    function getPage(start, end) {
        return quantity.slice(start, end)
            .map(pg => (<li onClick={() => setPage({...page, number: pg})}
                            style={{backgroundColor: (page.number === pg) && `#3A80BA`}}>
                <span style={{color: (page.number === pg) && `#FFFFFF`}}>{pg}</span></li>));

    }

    function minusPage() {
        if (page.start !== 0) {
            setPage({
                ...page, start: page.start - 5, end: page.end - 5,
                number: page.end - 9, status: 'minus'
            });
        } else {
            return false;
        }
    }

    function addPage() {
        if (page.end !== quantity.length) {
            setPage({
                ...page, start: page.start + 5, end: page.end + 5,
                number: page.end + 1, status: 'add'
            });
        } else {
            return false;
        }
    }

    let row = () => {
        if (total.length > 0) {
            return total.map((user, index) => (
                <tr className='statistics-table_tr' key={user.id} onClick={() => {
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
        <div className='statistics'>


            <header className="header-statistic">
                <div className="header-statistic__top">
                    <div className="header-statistic__top-title">
                        AppCo
                    </div>
                </div>
                <div className="header-statistic__nav">
                    <ul>
                        <li><Link to='/'>Main page</Link></li>
                        <li></li>
                        <li>User satistics</li>
                    </ul>
                </div>
            </header>


            <main className="main-statistics">
                <div className="main-statistics__container">
                    <div className="main-statistics__title">
                        Users statistics
                    </div>
                    <table className='statistics-table'>
                        <thead>
                        <tr>
                            <th>id</th>
                            <th>First Name</th>
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

                </div>

            </main>

            <div className="pagination-statistics">
                <ul>
                    <li onClick={minusPage}>
                        <div style={{borderColor: (page.status === 'minus') && `#3A80BA`}}></div>
                    </li>
                    {getPage(page.start, page.end)}
                    <li onClick={addPage}>
                        <div style={{borderColor: (page.status === 'add') && `#3A80BA`}}></div>
                    </li>
                </ul>
            </div>



            <footer className="footer-statistics">
                <div className="footer-statistics__container">
                    <div className="footer-statistics__container_title">AppCo</div>
                    <div className="footer-statistics__container_center">
                        All rights reserved by ThemeTags
                    </div>
                    <div className="footer-statistics__container_text">Copyrights © 2019.</div>
                </div>
            </footer>


        </div>

    );
}

export default Statistics;




