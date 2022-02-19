import React from 'react';
import MemeGallery, {PageType} from './MemeGallery';

export default class LikedMemes extends React.Component{
    render() {
        return (
            <div class="content">
                <h4>Your Liked Memes</h4>
                <MemeGallery pageType={PageType.TOP_MEMES}></MemeGallery>
            </div>
        );
    }
}