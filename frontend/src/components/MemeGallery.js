import React, {Component} from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";
import MemeService from "../services/meme.service";
import ListMeme from './MemeListItem';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import EventBus from "../common/EventBus";

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
    constructor(props) {
        super(props);

        this._isMounted = false;

        this.state = {
            redirect: null,
            userReady: false,
            currentUser: {userID: -1},
            pageType: props.pageType,
            byUser: props.byUser,
            memes: []
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

            this._isMounted && this.setState({
                memes: response.data,
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

        this._isMounted && this.setState({currentUser: user, byUser: byUser, userReady: true});
    }

    //Mark component as unmounted in order to prevent updating state on unmounted component
    componentWillUnmount() {
        this._isMounted = false;
    }

    //Remove a meme from the list, either by deletion or disliking on the liked memes page
    removeMeme = (index) => {
        this.state.memes.splice(index, 1);
        this._isMounted && this.setState({
            memes: this.state.memes
        });
    }

    render() {
        if (this.state.redirect) { //Redirect if not authenticated
            return <Redirect to={this.state.redirect} />
        }

        const { currentUser, memes, userReady} = this.state;

        return (
            <div>
                {(userReady) ?
            <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3, 1400: 4, 2000: 5}}>
                <Masonry>
                    { memes.map((meme, index) => <ListMeme
                        meme={meme}
                        pageType={this.state.pageType}
                        index={index}
                        key={meme.id}
                        removeMeme={this.removeMeme}
                        currentUser={currentUser}/>) }
                </Masonry>
            </ResponsiveMasonry>
             : null }
            </div>
        );
    }
}