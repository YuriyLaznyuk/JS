import React, {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import DatePicker, {registerLocale} from 'react-datepicker';
import uk from "date-fns/locale/uk";

registerLocale("uk", uk);
import "react-datepicker/dist/react-datepicker.css";
import './styles/userPage.scss';

function UserPage(props) {
    const ref = useRef();
    const ref1 = useRef();
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
        let tmp = new Date(date);
        tmp.setDate(tmp.getDate() + 1);
        return (
            tmp.toISOString().slice(0, 10)
        );
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

    function draw(ctx, canvas, key) {
        resize(ctx, canvas);
        // ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = `#FFFFFF`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.strokeStyle = `#CCCCCC`;
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
        ctx.textAlign = "left";
        ctx.fillText("1000", 0, 20);
        ctx.fillText("800", 10, 70);
        ctx.fillText("600", 10, 120);
        ctx.fillText("400", 10, 170);
        ctx.fillText("200", 10, 220);
        ctx.fillText("0", 30, 270);
        ctx.fillText("Nov", 135, 300);
        ctx.fillText("Dec", 270, 300);
        ctx.fillText("Jan", 405, 300);
        ctx.fillText("Feb", 540, 300);
        ctx.fillText("Mar", 675, 300);
        ctx.fillText("Apr", 810, 300);
        ctx.fillText("May", 945, 300);
        ctx.fillText("Jun", 1080, 300);

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.strokeStyle = `#3A80BA`;
        ctx.lineWidth = 6;
        ctx.lineJoin = 'round';
        for (let i = 0; i < coordinates.length; i++) {
            if (i === 0) {
                ctx.moveTo(coordinates[i]['date'] * 30, (270 - coordinates[i][key] * 0.25));
            } else
                ctx.lineTo(coordinates[i]['date'] * 30, (270 - coordinates[i][key] * 0.25));
        }
        // ctx.closePath();
        ctx.stroke();
        const index = coordinates.length - 1;
        ctx.beginPath();
        // ctx.scale(1, 1);
        ctx.fillStyle = '#3A80BA';
        ctx.arc(coordinates[0]['date'] * 30, (270 - coordinates[0][key] * 0.25),
            8, 0, 2 * Math.PI);

        ctx.arc(coordinates[index]['date'] * 30, (270 - coordinates[index][key] * 0.25),
            8, 0, 2 * Math.PI);

        ctx.fill();

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
                draw(ctx, canvas, 'clicks');
                //canvas1//
                const canvas1 = ref1.current;
                canvas1.width = 1200;
                canvas1.height = 330;
                const ctx1 = canvas1.getContext('2d');
                draw(ctx1, canvas1, 'page_views');
            });
    }, []);

    console.log(str(startDate));
    console.log(str(endDate));
    rangeData(str(startDate), str(endDate));
    console.log(strDates());

    return (
        <div className='userPage'>


            <header className="header-userPage">
                <div className="header-userPage__top">
                    <div className="header-userPage__top-title">
                        AppCo
                    </div>
                </div>
                <div className="header-userPage__nav">
                    <ul>
                        <li><Link to='/'>Main page</Link></li>
                        <li></li>
                        <li><Link to='/statistics'>User satistics</Link></li>
                        <li></li>
                        <li>{name}</li>
                    </ul>
                </div>
                <div className="header-userPage__user">
                    <div className="header-userPage__user-name">{name}</div>
                    <div className="header-userPage__user-datePicker">
                        <span>Select date range</span>
                        <span> <DatePicker
                            selectsRange={true}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(update) => {
                                setDateRange(update);
                            }}
                            isClearable={true}
                            locale="uk"
                        /></span>
                    </div>
                </div>
            </header>


            <main className="main-userPage">
                <section className="main-userPage__content">
                    <div className="main-userPage__content-title">Clicks</div>
                    <div className="main-userPage__content-canvas">
                        <canvas ref={ref}></canvas>
                    </div>

                </section>
                <section className="main-userPage__content">
                    <div className="main-userPage__content-title">Vievs</div>
                    <div className="main-userPage__content-canvas">
                        <canvas ref={ref1}></canvas>
                    </div>

                </section>

            </main>


            <footer className="footer-userPage">
                <div className="footer-userPage__container">
                    <div className="footer-userPage__container_title">AppCo</div>
                    <div className="footer-userPage__container_center">
                        All rights reserved by ThemeTags
                    </div>
                    <div className="footer-userPage__container_text">Copyrights © 2019.</div>
                </div>
            </footer>


        </div>
    );
}

export default UserPage;