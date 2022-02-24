import React, {Component} from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";
import MemeService from "../services/meme.service";
import ListMeme from './MemeListItem';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import EventBus from "../common/EventBus";
import styles from "./css/MemeGallery.module.css";

export const PageType = {
    TOP_MEMES: 1,
    LIKED_MEMES: 2,
    PROFILE: 3
}

/* 
* The Meme Gallery component displays a list of memes
* Properties:
*   pageType - indicates which query to send to the database, whether it be for the top memes, liked memes, or memes by user
*   byUser - only applies to PageType.PROFILE, which user to fetch data for
*/
export default class MemeGallery extends Component {
    numItemsPerPage = 20;

    constructor(props) {
        super(props);

        this._isMounted = false;

        this.state = {
            redirect: null,
            ready: 0,
            currentUser: {userID: -1},
            pageType: props.pageType,
            byUser: props.byUser,
            pages: [],
            page: 0,
            pageCount: 0
        };
    }

    componentDidMount() {
        this._isMounted = true;
        const baseUrl = "http://localhost:8080/files/";
        
        //Redirect to home if logged out
        const user = AuthService.getCurrentUser();
        if (!user) {
            this.setState({ redirect: "/" });
            return;
        }
        const byUser = this.state.byUser ? this.state.byUser : user.id;

        //Request memes from database API
        var data;
        switch(this.state.pageType) {
            case PageType.TOP_MEMES:
                data = MemeService.getTopMemes();
                break;
            case PageType.LIKED_MEMES:
                data = MemeService.getLikedMemes();
                break;
            case PageType.PROFILE:
                data = MemeService.getMemesByUser(byUser);
                break;
            default:
                data = MemeService.getMemes();
        }
        //Handle response from API
        data.then((response) => {
            //Append full path to image URLS
            response.data.forEach(function(part) {
                part.url = baseUrl + part.url;
            });

            //Split list of memes into pages
            let count = Math.ceil(response.data.length / this.numItemsPerPage)
            let array = []
            for (let i = 0; i < count; i++) {
                array.push(response.data.splice(0, this.numItemsPerPage));
            }
            
            this._isMounted && this.setState({
                pages: array,
                pageCount: count - 1,
                ready: this.state.ready + 1
            });
        },
        error => {
            //Handle errors
            alert((error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString());
    
            if (error.response && error.response.status === 401) {
              EventBus.dispatch("logout");
            }
        });

        this._isMounted && this.setState({currentUser: user, byUser: byUser, ready: this.state.ready + 1});
    }

    //Mark component as unmounted in order to prevent updating state on unmounted component
    componentWillUnmount() {
        this._isMounted = false;
    }

    //Remove a meme from the list, either by deletion or disliking on the liked memes page
    removeMeme = (index) => {
        let memes = this.state.pages[this.state.page];
        memes.splice(index, 1);
        this._isMounted && this.setState({
            pages: this.state.pages
        });
    }

    //Change page
    changePage = (newPage) => {
        newPage = Math.max(0, Math.min(newPage, this.state.pageCount));
        this._isMounted && this.setState({
            page: newPage
        });
        //Scroll back to top
        window.scrollTo(0, 0);
    }

    render() {
        if (this.state.redirect) { //Redirect if not authenticated
            return <Redirect to={this.state.redirect} />
        }

        const { currentUser, pages, ready, page, pageCount} = this.state;
        var memes = pages[page];
        
        if (ready > 1) //If both user and meme content is loaded
        return (
            <div>
                <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3, 1400: 4, 2000: 5}}>
                    <Masonry>
                        { memes.map((meme, index) =>
                        <ListMeme
                            meme={meme}
                            pageType={this.state.pageType}
                            index={index}
                            key={meme.id}
                            removeMeme={this.removeMeme}
                            currentUser={currentUser}/>) }
                    </Masonry>
                </ResponsiveMasonry>
                {pageCount > 0 ?
                <div className={styles.pageDiv}>
                    {page > 0 ?
                    <button className={styles.prevButton + " btn btn-primary"} onClick={() => this.changePage(page - 1)}>Previous</button>
                    : null}
                    <span className={styles.pageNumber}>{page + 1}</span>
                    {page < pageCount ?
                    <button className={styles.nextButton + " btn btn-primary"} onClick={() => this.changePage(page + 1)}>Next</button>
                    : null}
                </div>
                : null}
            </div>
        );
        else return null;
    }
}