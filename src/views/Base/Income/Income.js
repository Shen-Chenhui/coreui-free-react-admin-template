import React, { Component } from 'react';
import { Badge, Card, CardBody, CardColumns, CardHeader, Col, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Row, TabContent, TabPane } from 'reactstrap';
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

const backgroundColor = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
]

const hoverBackgroundColor = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
]

class Income extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.getSum = this.getSum.bind(this);
    this.state = {
      activeTab: 1,
      groupLabels: ['unsorted income', 'product sales','service', 'others'],
      initialGroup: [
        {amt:10000, date:"10 March 2019", to: "xxx-xxx-xxx", descr: "STOCK_PUR"},
        {amt:30000, date:"15 March 2019", to: "xxx-xxx-xxx", descr: "STOCK_PUR"},
        {amt:5000, date:"20 March 2019", to: "xxx-xxx-xxx", descr: "CONSULT"},
        {amt:3500, date:"31 March 2019", to: "xxx-xxx-xxx", descr: "MISC"},
      ],
      productSaleGroup: [],
      serviceGroup: [],
      otherGroup: [],
      targetGroup: null,
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  getSum(group) {
    var sum = 0;
    for(var i=0; i<group.length; i++){
      sum += group[i].amt
    }
    return sum;
  }

  handleListClick(item,sourceName){
    if(!this.state.targetGroup){return;}
    var sourceGroup = [];
    var targetGroup = [];
    var newSource = [];
    var newTarget = [];
    // determin source group
    switch (sourceName){
      case "initialGroup":
        sourceGroup = this.state.initialGroup;
        break;
      case "productSaleGroup":
        sourceGroup = this.state.productSaleGroup;
        break;
      case "serviceGroup":
        sourceGroup = this.state.serviceGroup;
        break;
      case "otherGroup":
        sourceGroup = this.state.otherGroup;
        break;
    }
    // determin target group
    switch (this.state.targetGroup){
      case "initialGroup":
        targetGroup = this.state.initialGroup;
        break;
      case "productSaleGroup":
        targetGroup = this.state.productSaleGroup;
        break;
      case "serviceGroup":
        targetGroup = this.state.serviceGroup;
        break;
      case "otherGroup":
        targetGroup = this.state.otherGroup;
        break;
    }

    if (sourceGroup == targetGroup){return;}
    var index = sourceGroup.indexOf(item)
    if (index > -1){
      newSource = [...sourceGroup.slice(0,index),...sourceGroup.slice(index+1)];
      newTarget = targetGroup.concat(item);
    }

    this.setState({
      [sourceName]: newSource,
      [this.state.targetGroup]: newTarget
    }
    );
    console.log(newSource, newTarget)
  }

  setTargetGroup(groupname){
    if (this.state.targetGroup == groupname){
      this.setState({
        targetGroup: null
      })
    } else{
      this.setState({
        targetGroup: groupname
      })
    }
  }

  componentWillUpdate(nextProps,nextState){
    this.unSortedAmt = this.getSum(nextState.initialGroup);
    this.productSaleAmt = this.getSum(nextState.productSaleGroup);
    this.serviceAmt = this.getSum(nextState.serviceGroup);
    this.otherAmt = this.getSum(nextState.otherGroup);
    this.doughnut = {
      labels: nextState.groupLabels,
      datasets: [
        {
          data: [this.unSortedAmt, this.productSaleAmt, this.serviceAmt, this.otherAmt],
          backgroundColor: backgroundColor,
          hoverBackgroundColor: hoverBackgroundColor,
        }],
    };
  }

  render() {
    this.unSortedAmt = this.getSum(this.state.initialGroup);
    this.productSaleAmt = this.getSum(this.state.productSaleGroup);
    this.serviceAmt = this.getSum(this.state.serviceGroup);
    this.otherAmt = this.getSum(this.state.otherGroup);
    this.doughnut = {
      labels: this.state.groupLabels,
      datasets: [
        {
          data: [this.unSortedAmt, this.productSaleAmt, this.serviceAmt, this.otherAmt],
          backgroundColor: backgroundColor,
          hoverBackgroundColor: hoverBackgroundColor,
        }],
    };

    return (
      <div className="animated fadeIn container">
        <div className="flexbox-item">
          <Col>
            <Card>
              <CardHeader>
                Income Breakdown
                <div className="card-header-actions">
                  <a href="http://www.chartjs.org" className="card-header-action">
                    <small className="text-muted">docs</small>
                  </a>
                </div>
              </CardHeader>
              <CardBody>
                <div className="chart-wrapper">
                  <Doughnut data={this.doughnut} />
                </div>
              </CardBody>
            </Card>
            <Card className={this.state.targetGroup == "initialGroup"? "outline-class" : null}>
              <CardHeader onClick={()=>this.setTargetGroup("initialGroup")}>
                <i className="fa fa-align-justify"></i><strong>Unsorted Income</strong>
              </CardHeader>
              <CardBody>
                <ListGroup>
                  <ListGroupItem>
                    <Row>
                      <Col><b>Transaction Amount</b></Col>
                      <Col><b>Date</b></Col>
                      <Col><b>Destination</b></Col>
                      <Col><b>Description</b></Col>
                    </Row>
                  </ListGroupItem>
                  { this.state.initialGroup.map( (item) =>(
                        <ListGroupItem onClick={()=>this.handleListClick(item,"initialGroup")}>
                          <Row>
                            <Col> ${item.amt} </Col>
                            <Col> {item.date} </Col>
                            <Col> {item.to}</Col>
                            <Col> {item.descr}</Col>
                          </Row>
                        </ListGroupItem>
                      ))
                  }
                </ListGroup>
              </CardBody>
              <CardHeader className="text-expense">Total Income: ${this.unSortedAmt} </CardHeader>
            </Card>
          </Col>
        </div>
        <div className="flexbox-item">
          <Col>
            <Row>
              <Card className={this.state.targetGroup == "productSaleGroup"? "outline-class" : null}>
              <CardHeader  onClick={()=>this.setTargetGroup("productSaleGroup")}>
              <i className="fa fa-align-justify"></i><strong>Product Sales</strong>
              </CardHeader>
              <CardBody>
              <ListGroup>
              <ListGroupItem>
              <Row>
              <Col><b>Transaction Amount</b></Col>
              <Col><b>Date</b></Col>
              <Col><b>Destination</b></Col>
              <Col><b>Description</b></Col>
              </Row>
              </ListGroupItem>
              { this.state.productSaleGroup.map( (item) =>(
                <ListGroupItem onClick={()=>this.handleListClick(item,"productSaleGroup")}>
                <Row>
                <Col> ${item.amt} </Col>
                <Col> Date: {item.date} </Col>
                <Col> To: {item.to}</Col>
                <Col> Descr: {item.descr}</Col>
                </Row>
                </ListGroupItem>
                ))
              }
              </ListGroup>
              </CardBody>
              <CardHeader className="text-expense">Total Income: ${this.productSaleAmt} </CardHeader>
              </Card>
            </Row>
            <Row>
              <Card className={this.state.targetGroup == "serviceGroup"? "outline-class" : null}>
              <CardHeader  onClick={()=>this.setTargetGroup("serviceGroup")}>
              <i className="fa fa-align-justify"></i><strong>Service</strong>
              </CardHeader>
              <CardBody>
              <ListGroup>
              <ListGroupItem>
                <Row>
                <Col><b>Transaction Amount</b></Col>
                <Col><b>Date</b></Col>
                <Col><b>Destination</b></Col>
                <Col><b>Description</b></Col>
                </Row>
              </ListGroupItem>
              { this.state.serviceGroup.map( (item) =>(
                <ListGroupItem onClick={()=>this.handleListClick(item,"serviceGroup")}>
                <Row>
                <Col> ${item.amt} </Col>
                <Col> Date: {item.date} </Col>
                <Col> To: {item.to}</Col>
                <Col> Descr: {item.descr}</Col>
                </Row>
                </ListGroupItem>
                ))
              }
              </ListGroup>
              </CardBody>
              <CardHeader className="text-expense">Total Income: ${this.serviceAmt} </CardHeader>
              </Card>
            </Row>
            <Row>
              <Card className={this.state.targetGroup == "otherGroup"? "outline-class" : null}>
              <CardHeader  onClick={()=>this.setTargetGroup("otherGroup")}>
              <i className="fa fa-align-justify"></i><strong>Other</strong>
              </CardHeader>
              <CardBody>
              <ListGroup>
              <ListGroupItem>
                <Row>
                <Col><b>Transaction Amount</b></Col>
                <Col><b>Date</b></Col>
                <Col><b>Destination</b></Col>
                <Col><b>Description</b></Col>
                </Row>
              </ListGroupItem>
              { this.state.otherGroup.map( (item) =>(
                <ListGroupItem onClick={()=>this.handleListClick(item,"otherGroup")}>
                <Row>
                <Col> ${item.amt} </Col>
                <Col> Date: {item.date} </Col>
                <Col> To: {item.to}</Col>
                <Col> Descr: {item.descr}</Col>
                </Row>
                </ListGroupItem>
                ))
              }
              </ListGroup>
              </CardBody>
              <CardHeader className="text-expense">Total Income: ${this.otherAmt} </CardHeader>
              </Card>
            </Row>
          </Col>
        </div>
      </div>
    );
  }
}

export default Income;
