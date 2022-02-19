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

export default class MemeGallery extends Component {
    constructor(props) {
        super(props);

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
        const baseUrl = "http://localhost:8080/files/";
        
        const user = AuthService.getCurrentUser();
        if (!user) {
            this.setState({ redirect: "/" });
            return;
        }
        const byUser = this.state.byUser ? this.state.byUser : user.id;

        var data;
        switch(this.state.pageType) {
            case PageType.TOP_MEMES:
                data = MemeService.getTopMemes();
                break;
            case PageType.LIKED_MEMES:
                console.log(user.id);
                data = MemeService.getLikedMemes(user.id);
                break;
            case PageType.PROFILE:
                data = MemeService.getMemesByUser(byUser);
                break;
            case PageType.HOME:
                data = MemeService.getNewMemesFor(byUser);
                break;
            default:
                data = MemeService.getMemes();
        }
        data.then((response) => {
            //fix urls to be full paths
            response.data.forEach(function(part, index) {
                part.url = baseUrl + part.url;
            });

            this.setState({
                memes: response.data,
            });
        },
        error => {
            alert((error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString());
    
            if (error.response && error.response.status === 401) {
              EventBus.dispatch("logout");
            }
        });

        this.setState({currentUser: user, byUser: byUser, userReady: true});
    }

    //Needs to be a lambda function or the page freezes! Don't change it!
    /*RemoveMemeTest = () => {
        this.setState({
            memes: this.state.memes.splice(0, this.state.memes.length-1)
        });
    }*/

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        const { currentUser, memes, userReady} = this.state;

        return (
            <div>
                {(userReady) ?
            <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3, 1400: 4, 2000: 5}}>
                <Masonry>
                    { memes.map(meme => <ListMeme meme={meme} key={meme.id} 
                    currentUser={currentUser}></ListMeme>) }
                </Masonry>
            </ResponsiveMasonry>
             : null }
            </div>
        );
    }
}