import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'showOperator'})
export class showOperatorPipe implements PipeTransform {
  transform(value: string) {
  	let allOperator = {
  		"EQUALS" : "=",
  		"NOT_EQUALS" : "<>",
  		"GREATER_THAN" : ">",
      "LESS_THAN" : "<",
  		"GREATER_THAN_EQUALS" : ">=",
  		"LESS_THAN_EQUALS" : "<="
  	};
  	let equalnotEqualOpearator = {
  		"EQUALS" : "=",
  		"NOT_EQUALS" : "<>"
  	};
    var misMatchSymbols = {
      "GREATER" : "GREATER_THAN",
      "LESSER" : "LESS_THAN",
      "GREATER_THAN_OR_EQUAL" : "GREATER_THAN_EQUALS",
      "LESSER_THAN_OR_EQUAL" : "LESS_THAN_EQUALS"
    }
    if(!value) return "";
  	var requestType = value.split("|");
  	if(requestType.length > 1 && requestType[1] == "dataType"){
  		var dataType = requestType[0];
  		var operators = null;
  		var operatorList = [];
  		if(dataType == "string" || dataType == "enum" || dataType == "boolean" || dataType == "char")
  			operators = equalnotEqualOpearator;
  		else
				operators = allOperator;
  		for(var key in operators){
  			var obj = {
  				"label" : operators[key],
  				"value" : key
  			}
  			operatorList.push(obj);
  		}
  		return operatorList;
  	}else if(requestType.length > 1 && requestType[1] == "metaDataOperator"){
			return misMatchSymbols[requestType[0]] ? misMatchSymbols[requestType[0]] : requestType[0];
		}else{
      var type = misMatchSymbols[requestType[0]] ? misMatchSymbols[requestType[0]] : requestType[0];
  		var symbol = allOperator[type];
      if(symbol)
        return symbol;
      else{
        for(var key in allOperator){
          if(requestType[0] == allOperator[key])
            symbol = key;
        }
      }
  		return symbol ? symbol : "";
  	}
  }
}
