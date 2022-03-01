import React from "react"

class Trial extends React.Component{
    render(){
        //render adalah fungsi untuk tampilan elemen ini
        return(
            <div className={`alert alert-${this.props.bgColor}`}>
                <h3 className="text-black">{this.props.title}</h3>
                <small className="text-danger">{this.props.subtitle}</small>
            </div>
        )
    }
}

export default Trial 