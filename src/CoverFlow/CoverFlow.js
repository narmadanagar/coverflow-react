import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SIDES from './SIDES'
import CoverFlowItem from './CoverFlowItem';

class CoverFlow extends React.Component {
  constructor(props){
    super(props);
    this.selectItem = this.selectItem.bind(this);
    this.prepareItems = this.prepareItems.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.state = {
      selectedIndex: this.props.imagesArr.length ? parseInt(this.props.imagesArr.length / 2, 10) : -1
    };
  }
  render(){
    let styles = {
      textAlign: 'center',
      perspective: '400px',
      margin: '0px',
      position: 'relative',
      height: `${this.props.height}px`,
      boxSizing: 'border-box',
      padding: '25px',
      outline: 'transparent',
      background: this.props.background,
      border: this.props.border,
      boxShadow: this.props.boxShadow
    };

    if (this.props.imagesArr.length === 0) {
      return (
        <div style={styles}>
          <div style={{
            display: 'inline-block',
            position: 'absolute',
            left: '50%',
            top: '50%'
          }}>{this.props.emptyMessage}</div>
        </div>
      )
    }
    let ratio = {};
    [ratio.x, ratio.y] = this.props.itemRatio.split(':').map(x=>parseFloat(x));
    const itemHeight = this.props.height - 60;
    const itemWidth = itemHeight * ratio.x / ratio.y;

    let items = this.prepareItems();
    return(
      <div tabIndex="0" onKeyDown={this.handleKeyDown} style={styles}>
        {items.map((item, index)=>{
          return <CoverFlowItem 
                    side={item.side} 
                    distance={item.distance} 
                    imgUrl={item.imgUrl}
                    selectItem={this.selectItem}
                    index={index}
                    zIndex={this.props.zIndex}
                    height={itemHeight}
                    width={itemWidth}
                    key={index} />;
        })}
      </div>
    );
  }
  selectItem(index){
    this.setState({selectedIndex: index});
  }
  prepareItems(){
    const imagesArr = _.cloneDeep(this.props.imagesArr);
    if (imagesArr.length === 0){
      return [];
    }
    const index = this.state.selectedIndex;
    const items = imagesArr.map(imgUrl=>({imgUrl}));
    items[index].side = SIDES.CENTER;
    items[index].distance = 0;

    for(let i = 0; i < index; i++){
      items[i].side = SIDES.LEFT;
      items[i].distance = index - i;
    }

    for(let i = index + 1; i < items.length; i++){
      items[i].side = SIDES.RIGHT;
      items[i].distance = i - index;
    }
    return items;
  }
  handleKeyDown(e){
    let index = this.state.selectedIndex;
    if (e.keyCode === 37){
      // left
      if(index > 0){
        this.selectItem(index - 1);
      }
    } else if (e.keyCode === 39) {
      // right
      if(index + 1 < this.props.imagesArr.length){
        this.selectItem(index + 1);
      }
    }
  }
}

CoverFlow.propTypes = {
  imagesArr: PropTypes.array.isRequired,
  zIndex: PropTypes.number,
  height: PropTypes.number,
  background: PropTypes.string,
  border: PropTypes.string,
  boxShadow: PropTypes.string,
  emptyMessage: PropTypes.string,
  itemRatio: PropTypes.string
};

CoverFlow.defaultProps = {
  zIndex: 100,
  height: 300,
  background: 'lightgray',
  border: 'none',
  boxShadow: 'none',
  emptyMessage: 'No items to show.',
  itemRatio: '8:5'
};

export default CoverFlow;