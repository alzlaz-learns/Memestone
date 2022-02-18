import React, {Component} from "react";
import AuthService from "../services/auth.service";
import MemeService from "../services/meme.service";
import ListMeme from './MemeListItem';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"

export const PageType = {
    TOP_MEMES: 1,
    LIKED_MEMES: 2,
    PROFILE: 3
}

export default class MemeGallery extends Component {
    constructor(props) {
        super(props);
        const user = AuthService.getCurrentUser();

        this.state = {
            currentUser: user,
            pageType: props.pageType,
            byUser: props.byUser ? props.byUser : user.username,
            memes: []
        };

    }

    componentDidMount() {
        const baseUrl = "http://localhost:8080/files/";

        var data;
        switch(this.state.pageType) {
            case PageType.TOP_MEMES:
                data = MemeService.getTopMemes();
                break;
            case PageType.LIKED_MEMES:
                data = MemeService.getLikedMemes(this.state.currentUser.username);
                break;
            case PageType.PROFILE:
                data = MemeService.getMemesByUser(this.state.byUser);
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
        });
    }

    //Needs to be a lambda function or the page freezes! Don't change it!
    /*RemoveMemeTest = () => {
        this.setState({
            memes: this.state.memes.splice(0, this.state.memes.length-1)
        });
    }*/

    render() {
        const { memes } = this.state;

        return (
            <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3, 1400: 4, 2000: 5}}>
                <Masonry>
                    { memes.map(meme => <ListMeme meme={meme} key={meme.id}></ListMeme>) }
                </Masonry>
            </ResponsiveMasonry>
        );
    }
}