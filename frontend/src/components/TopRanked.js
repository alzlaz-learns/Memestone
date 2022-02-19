import React from 'react';
import MemeGallery, {PageType} from './MemeGallery';

export default class TopRanked extends React.Component{
    render() {
        return (
            <div className="content">
                <h4>Top Ranked Memes</h4>
                <MemeGallery pageType={PageType.TOP_MEMES}></MemeGallery>
            </div>
        );
    }
}