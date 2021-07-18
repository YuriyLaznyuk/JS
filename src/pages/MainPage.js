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

            <div className="mainPage">
                <header className="header">
                    <div className="header__content">
                        <div className="content__title">AppCo</div>
                        <div className="content__title_1"><span>Brainstorming&nbsp;</span>for<br/>
                            desired perfect Usability
                        </div>
                        <div className="content__text">
                            Our design projects are fresh and simple and will benefit<br/>
                            your business greatly. Learn more about our work!
                        </div>
                        <div className="content__btn-block">
                            <Link to="/statistics" className="content__btn">Views Stats</Link>
                        </div>
                    </div>
                    <div className="header__img">
                        <img src={require("../pages/img/mobile.png")} alt="mobile" className="header__mobile"/>
                    </div>
                </header>
                <main className="page">
                    <div className="page__title">Why <span>small business owners</span><br/>
                        <span>love</span> AppCo?
                    </div>
                    <div className="page__text">Our design projects are fresh and simple and
                        will benefit your business <br/>
                            greatly. Learn more about our work!
                    </div>

                    <div className="page__block-card">

                        <div className="page__card">
                            <div className="page__card-container">
                                <img className="page__card-img" src={require("../pages/img/group1.png")} alt="img"/>
                                    <div className="page__card-title">Clean Design</div>
                                    <div className="page__card-text">Increase sales by showing true<br/>
                                        dynamics of your website.
                                    </div>
                            </div>

                        </div>

                        <div className="page__card">
                            <div className="page__card-container">
                                <img className="page__card-img" src={require("../pages/img/group2.png")} alt="img"/>
                                    <div className="page__card-title">Secure Data</div>
                                    <div className="page__card-text">Build your online store’s trust<br/>
                                        using Social Proof & Urgency.
                                    </div>
                            </div>


                        </div>
                        <div className="page__card">
                            <div className="page__card-container">
                                <img className="page__card-img" src={require('../pages/img/group3.png')} alt="img"/>
                                    <div className="page__card-title">Retina Ready</div>
                                    <div className="page__card-text">Realize importance of social proof<br/>
                                        in customer’s purchase decision.
                                    </div>
                            </div>

                        </div>


                    </div>
                </main>
                <footer className="footer">

                    <div className="footer__container">
                        <div className="footer__input">

                            <div className="footer__search">
                                <input type="text" placeholder="Enter your email"/>
                                    <button>Subscribe</button>
                            </div>

                        </div>

                        <div className="footer__bottom">
                            <div className="footer__bottom-right">AppCo</div>
                            <div className="footer__bottom-center">All rights reserved by ThemeTags</div>
                            <div className="footer__bottom-left">Copyrights © 2019.</div>
                        </div>

                    </div>


                </footer>

            </div>


    );
}

export default MainPage;