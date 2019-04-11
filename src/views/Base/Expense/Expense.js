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

class Expense extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.getSum = this.getSum.bind(this);
    this.state = {
      activeTab: 1,
      groupLabels: ['unsorted expense', 'payroll','operations', 'others'],
      initialGroup: [
        {amt:1200, date:"1 March 2019", to: "xxx-xxx-xxx", descr: "SALARY"},
        {amt:3500, date:"1 March 2019", to: "xxx-xxx-xxx", descr: "SALARY"},
        {amt:5000, date:"1 March 2019", to: "xxx-xxx-xxx", descr: "SALARY"},
        {amt:3500, date:"1 March 2019", to: "xxx-xxx-xxx", descr: "SALARY"},
        {amt:6000, date:"1 March 2019", to: "xxx-xxx-xxx", descr: "SALARY"},
        {amt:100, date:"12 March 2019", to: "xxx-xxx-xxx", descr: "SUP_COST"},
        {amt:300, date:"14 March 2019", to: "xxx-xxx-xxx", descr: "TRAFFIC"},
        {amt:500, date:"20 March 2019", to: "xxx-xxx-xxx", descr: "ELECTRICITY"},
        {amt:3000, date:"22 March 2019", to: "xxx-xxx-xxx", descr: "ANIV_PURC"},
        {amt:2000, date:"25 March 2019", to: "xxx-xxx-xxx", descr: "SUP_COST"},
      ],
      payRollGroup: [],
      operationGroup: [],
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
    var sourceGroup = [];
    var targetGroup = [];
    var newSource = [];
    var newTarget = [];
    // determin source group
    switch (sourceName){
      case "initialGroup":
        sourceGroup = this.state.initialGroup;
        break;
      case "payRollGroup":
        sourceGroup = this.state.payRollGroup;
        break;
      case "operationGroup":
        sourceGroup = this.state.operationGroup;
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
      case "payRollGroup":
        targetGroup = this.state.payRollGroup;
        break;
      case "operationGroup":
        targetGroup = this.state.operationGroup;
        break;
      case "otherGroup":
        targetGroup = this.state.otherGroup;
        break;
    }

    if (sourceGroup === targetGroup){return;}
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
    console.log("set target group to " + groupname)
    this.setState({
      targetGroup: groupname
    })
  }

  componentWillUpdate(nextProps,nextState){
    this.unSortedAmt = this.getSum(nextState.initialGroup);
    this.payrollAmt = this.getSum(nextState.payRollGroup);
    this.operationAmt = this.getSum(nextState.operationGroup);
    this.otherAmt = this.getSum(nextState.otherGroup);
    this.doughnut = {
      labels: nextState.groupLabels,
      datasets: [
        {
          data: [this.unSortedAmt, this.payrollAmt, this.operationAmt, this.otherAmt],
          backgroundColor: backgroundColor,
          hoverBackgroundColor: hoverBackgroundColor,
        }],
    };
  }

  render() {
    this.unSortedAmt = this.getSum(this.state.initialGroup);
    this.payrollAmt = this.getSum(this.state.payRollGroup);
    this.operationAmt = this.getSum(this.state.operationGroup);
    this.otherAmt = this.getSum(this.state.otherGroup);
    this.doughnut = {
      labels: this.state.groupLabels,
      datasets: [
        {
          data: [this.unSortedAmt, this.payrollAmt, this.operationAmt, this.otherAmt],
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
                Expense Breakdown
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
            <Card className={this.state.targetGroup === "initialGroup"? "outline-class" : null}>
              <CardHeader onClick={()=>this.setTargetGroup("initialGroup")}>
                <i className="fa fa-align-justify"></i><strong>Unsorted Records</strong>
                <div className="card-header-actions">
                  <a href="https://reactstrap.github.io/components/listgroup/" rel="noreferrer noopener" target="_blank" className="card-header-action">
                    <small className="text-muted">docs</small>
                  </a>
                </div>
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
              <CardHeader className="text-expense">Total Expense: ${this.getSum(this.state.initialGroup)} </CardHeader>
            </Card>
          </Col>
        </div>
        <div className="flexbox-item">
          <Col>
            <Row>
              <Card className={this.state.targetGroup === "payRollGroup"? "outline-class" : null}>
              <CardHeader  onClick={()=>this.setTargetGroup("payRollGroup")}>
              <i className="fa fa-align-justify"></i><strong>Pay Roll</strong>
              <div className="card-header-actions">
              <a href="https://reactstrap.github.io/components/listgroup/" rel="noreferrer noopener" target="_blank" className="card-header-action">
              <small className="text-muted">docs</small>
              </a>
              </div>
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
              { this.state.payRollGroup.map( (item) =>(
                <ListGroupItem onClick={()=>this.handleListClick(item,"payRollGroup")}>
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
              <CardHeader className="text-expense">Total Expense: ${this.getSum(this.state.payRollGroup)} </CardHeader>
              </Card>
            </Row>
            <Row>
              <Card className={this.state.targetGroup === "operationGroup"? "outline-class" : null}>
              <CardHeader  onClick={()=>this.setTargetGroup("operationGroup")}>
              <i className="fa fa-align-justify"></i><strong>Operation</strong>
              <div className="card-header-actions">
              <a href="https://reactstrap.github.io/components/listgroup/" rel="noreferrer noopener" target="_blank" className="card-header-action">
              <small className="text-muted">docs</small>
              </a>
              </div>
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
              { this.state.operationGroup.map( (item) =>(
                <ListGroupItem onClick={()=>this.handleListClick(item,"operationGroup")}>
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
              <CardHeader className="text-expense">Total Expense: ${this.getSum(this.state.operationGroup)} </CardHeader>
              </Card>
            </Row>
            <Row>
              <Card className={this.state.targetGroup === "otherGroup"? "outline-class" : null}>
              <CardHeader  onClick={()=>this.setTargetGroup("otherGroup")}>
              <i className="fa fa-align-justify"></i><strong>Other</strong>
              <div className="card-header-actions">
              <a href="https://reactstrap.github.io/components/listgroup/" rel="noreferrer noopener" target="_blank" className="card-header-action">
              <small className="text-muted">docs</small>
              </a>
              </div>
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
              <CardHeader className="text-expense">Total Expense: ${this.getSum(this.state.otherGroup)} </CardHeader>
              </Card>
            </Row>
          </Col>
        </div>
      </div>
    );
  }
}

export default Expense;
