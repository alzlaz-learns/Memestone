import React from 'react';
import MemeGallery, {PageType} from './MemeGallery';

/*
* Liked Memes Page, showing a list of the memes the currently logged in user liked
*/
export default class LikedMemes extends React.Component{
    render() {
        return (
            <div className="content" key={Date.now()}>
                <h4>Your Liked Memes</h4>
                <MemeGallery pageType={PageType.LIKED_MEMES}></MemeGallery>
            </div>
        );
    }
}