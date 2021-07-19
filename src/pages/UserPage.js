import React, {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import DatePicker,{registerLocale} from 'react-datepicker';
import uk from "date-fns/locale/uk";
registerLocale("uk", uk);
import "react-datepicker/dist/react-datepicker.css";
import './styles/userPage.scss';

function UserPage(props) {
    const ref = useRef();
    const ref1=useRef();

    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [startDate, endDate] = dateRange;

    const dispatch = useDispatch();
    const {user, name} = useSelector(state => state.sqlite);
    const host = window.location.origin;
    let {id} = useParams();
    const coordinates = [];
    const range = [];

    // new Date method //
    const str = (date) => {
        let tmp=new Date (date);
        tmp.setDate(tmp.getDate()+1);
        return(
            tmp.toISOString().slice(0, 10)
        )
    };

    const rangeData = (start, end) => {
        if (new Date(start) > new Date(end)) {
            return false;
        } else {

            for (let i = new Date(start), id = new Date(end); i <= id; i.setDate(i.getDate() + 1)) {
                range.push(new Date(i));
            }
        }
    };

    const strDates = () => {
        return (
            range.length > 0 ? range.map(i => i.toISOString().slice(0, 10))
                : ''
        );
    };

    //-------//

    let row = () => {
        if (user.length > 0) {
            return user.map((user, index) => (
                <tr key={index}>
                    <td>{user.date}</td>
                    <td>{user.page_views}</td>
                    <td>{user.clicks}</td>
                </tr>
            ));
        } else {
            return '';
        }
    };

    const users = (user) => {
        user.length > 0 && user.map(elem => {
            let tmp = elem['date'].split('-')[2];
            let day = null;
            tmp[0] === 0 ? day = parseInt(tmp[1]) : day = parseInt(tmp);
            elem['date'] = day;
            coordinates.push(elem);
        });

    };

    function resize(ctx, canvas) {

        let monitorWidth = canvas.clientWidth;
        let monitorHeight = canvas.clientHeight;

        if (canvas.width != monitorWidth ||
            canvas.height != monitorHeight) {
            canvas.width = monitorWidth;
            canvas.height = monitorHeight;
            return true;
        }
        return false;
    }

    function draw(ctx, canvas,key) {
        // resize(ctx, canvas);
        // ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = `#FFFFFF`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.lineWidth=1;
        ctx.beginPath();
        ctx.strokeStyle=`#CCCCCC`;
        ctx.moveTo(50, 14);
        ctx.lineTo(1190, 14);
        ctx.moveTo(50, 64);
        ctx.lineTo(1190, 64);
        ctx.moveTo(50, 114);
        ctx.lineTo(1190, 114);
        ctx.moveTo(50, 164);
        ctx.lineTo(1190, 164);
        ctx.moveTo(50, 214);
        ctx.lineTo(1190, 214);
        ctx.moveTo(50, 264);
        ctx.lineTo(1190, 264);
        ctx.stroke();

        ctx.font = "16px Montserrat";
        ctx.fillStyle = `#CCCCCC`;
        // ctx.lineWidth = 1;
        ctx.textAlign = "left";
        ctx.fillText("1000", 0, 20 );
        ctx.fillText("800", 10, 70 );
        ctx.fillText("600", 10, 120 );
        ctx.fillText("400", 10, 170 );
        ctx.fillText("200", 10, 220 );
        ctx.fillText("0", 30, 270 );
        ctx.fillText("Nov", 135, 300 );
        ctx.fillText("Dec", 270, 300 );
        ctx.fillText("Jan", 405, 300 );
        ctx.fillText("Feb", 540, 300 );
        ctx.fillText("Mar", 675, 300 );
        ctx.fillText("Apr", 810, 300 );
        ctx.fillText("May", 945, 300 );
        ctx.fillText("Jun", 1080, 300 );

        ctx.scale(1, 3);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.strokeStyle=`#3A80BA`;
        for (let i = 0; i < coordinates.length; i++) {
            if (i === 0) {
                ctx.moveTo(coordinates[i]['date'] * 30, (270 - coordinates[i][key] * 0.25) / 3);
            } else
                ctx.lineTo(coordinates[i]['date'] * 30, (270 - coordinates[i][key] * 0.25) / 3);
        }
        // ctx.closePath();
        ctx.stroke();

    }

    useEffect(() => {
        fetch(host + '/api/users/' + id)
            .then(res => res.json())
            .then(json => {
                users(json);
                dispatch({type: 'statistics user', payload: json});
                const canvas = ref.current;
                canvas.width = 1200;
                canvas.height = 330;
                const ctx = canvas.getContext('2d');
                draw(ctx, canvas,'clicks');
                //canvas1//
                const canvas1=ref1.current;
                canvas1.width=1200;
                canvas1.height=330;
                const ctx1=canvas1.getContext('2d');
                draw(ctx1, canvas1, 'page_views' );
            });
    }, []);

    console.log(str(startDate));
    console.log(str(endDate));
    rangeData(str(startDate), str(endDate));
    console.log(strDates());

    return (
        <div className='userPage'>
            <ul className='userPage-ul' style={{backgroundColor: '#005aff5c'}}>
                <li><Link to='/'>Main Page</Link></li>
                <li><Link to='/statistics'>User Statistic</Link></li>
                <li>{`User Name: `}<span style={{color: 'green'}}>{name}</span></li>
                <li id='userPage-date'><span>Select date range</span>

                    <DatePicker
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                            setDateRange(update);
                        }}
                        isClearable={true}
                        locale="uk"
                    />

                </li>
            </ul>
            <h1> User Page Id user: {id}</h1>
            <table className='userPage-table'>
                <thead>
                <tr>
                    <th>data</th>
                    <th>page views</th>
                    <th>clicks</th>
                </tr>

                </thead>
                <tbody>
                {row(user)}
                </tbody>
            </table>

            <canvas ref={ref}>
            </canvas>
            <canvas ref={ref1}>
            </canvas>


        </div>
    );
}

export default UserPage;