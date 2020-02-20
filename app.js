var budgetController=(function(){
    var Expense=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        this.percnentage=-1;
    };
    Expense.prototype.calcPercentage=function(totalIncome)
    {
        if(totalIncome>0)
            this.percnentage=Math.round((this.value/totalIncome)*100);
        else
            this.percnentage=-1;
    };
    Expense.prototype.getPercentage=function(){
        return this.percnentage;
    };
    var Income=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };
    var calculateTotal=function(type){
        var sum=0;
        data.allItem[type].forEach(function(cur){
            sum+=cur.value;
        });
        data.totals[type]=sum;
    };
    var data={
        allItem: {
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        precentage:-1
    };

    return{
        addItem:function(type,des,val){
            var newItem;
            if(data.allItem[type].length>0)
                var ID=data.allItem[type][data.allItem[type].length-1].id+1;
            else
                ID=0;
            if(type=='exp')
                newItem=new Expense(ID,des,val);
            else
                newItem=new Income(ID,des,val);
            data.allItem[type].push(newItem);
            return newItem;

        },
        testing:function(){
            console.log(data);
        },
        calculateBudget:function(){
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget=data.totals.inc-data.totals.exp;
            if(data.totals.inc>0)
                data.precentage=Math.round((data.totals.exp/data.totals.inc)*100);
            else
                data.precentage=-1;
        },
        deleteItem:function(type,id){
            var ids=data.allItem[type].map(function(current)
                                           {
                return current.id;
            }
                                          );
            var index=ids.indexOf(id);
            if(index!==-1)
            {
                data.allItem[type].splice(index,1)
            }
        },
        calculatePercentages:function()
        {
            data.allItem.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },
        getPercentages:function()
        {
            var allPerc=data.allItem.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
        },
        getBudget:function(){
            return {
                budget:data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                precentage:data.precentage
            }
        }

    };

})();

var UIController=(function() {
    var DOMstrings={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtm:'.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLabel:'.budget__expenses--value',
        precentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensesPercLabel:'.item__percentage',
        dateLabel:'.budget__title--month'


    };
   function formatNumber(num,type){
            num=Math.abs(num);
            num=num.toFixed(2);
            var numSplit=num.split('.');
            var int=numSplit[0];
            if(int.length>3)
            {
                int= int.substr(0,int.length-3)+','+int.substr(int.length-3,int.length);
            }
            var dec=numSplit[1];
            return (type==='exp'?'-':'+')+' '+int+'.'+dec;
        }
    nodeListForEach=function(list,callback){
                for(var i=0;i<list.length;i++)
                {
                    callback(list[i],i);
                }
            };
    
    
    return {
        getInput:function(){
            return{
                description:document.querySelector(DOMstrings.inputDescription).value,
                type: document.querySelector(DOMstrings.inputType).value,
                value:parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        displayMonth:function()
        {
            var now=new Date();
            var year=now.getFullYear();
            var Months=['January','February','March','April','May','June','July','August','September','October','November','December'];
            var month=Months[now.getMonth()];
            document.querySelector(DOMstrings.dateLabel).textContent=month+' '+year;
            
        },
        getDomStrings:function(){
            return DOMstrings;
        },
        addListItem:function(obj,type){
            var html,newHtml,element;  
            if(type==='inc'){
                html=  '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' ;
                element=DOMstrings.incomeContainer;
            }
            else{
                element=DOMstrings.expensesContainer;
                html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';}

            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        deleteListItem:function(SelectoprID){
            var el=document.getElementById(SelectoprID);
            el.parentNode.removeChild(el);
        },
        clearFields:function(){
            var fields= document.querySelectorAll(DOMstrings.inputDescription+', '+DOMstrings.inputValue);
            var fieldsArr= Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(cur){
                cur.value="";
            });
            fields[0].focus();
        },
        changedType:function()
        {
            var fields=document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputDescription +',' + DOMstrings.inputValue);
            nodeListForEach(fields,function(cur){
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputBtm).classList.toggle('red');
        },
        displayPercentages:function(percentages)
        {
            var fields=document.querySelectorAll(DOMstrings.expensesPercLabel);
            
            nodeListForEach(fields,function(current,index){
                if(percentages[index]>0)
                    current.textContent=percentages[index]+'%';
                else
                    current.textContent='---';  
            });
        },
        displayBudget:function(obj){
            var type;
            obj.budget>0?type='inc':type='exp';
            
            document.querySelector(DOMstrings.budgetLabel).textContent=formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeLabel).textContent=formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent=formatNumber(obj.totalExp,'exp');

            if(obj.precentage>0)
                document.querySelector(DOMstrings.precentageLabel).textContent=obj.precentage+'%';
            else{
                document.querySelector(DOMstrings.precentageLabel).textContent='---';
            }
        }
        

    };


}
                 )();
var controller=(function(budgetController,UICtrl){
    var setupEventListeners=function(){
        var DOM=UICtrl.getDomStrings();
        document.querySelector(DOM.inputBtm).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress',function(event){
            if(event.keyCode==13||event.which===13)
                ctrlAddItem();
            

        });
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
            document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);

    };

    var updateBudget=function(){
        budgetController.calculateBudget();
        var budget=budgetController.getBudget();
        UICtrl.displayBudget(budget);
    };
    var ctrlAddItem=function(){
        var input=UICtrl.getInput();
        if(input.description!==''&&!isNaN(input.value)&&input.value>0)
        {var item=budgetController.addItem(input.type,input.description,input.value);
         UIController.addListItem(item,input.type);
         UIController.clearFields();
         updateBudget();
         updatePercentages();}
    };
    var updatePercentages=function(){
        budgetController.calculatePercentages();
        var per= budgetController.getPercentages();

        UIController.displayPercentages(per);
    };
    var ctrlDeleteItem=function(event){
        var itemId,splitId,type,ID;
        itemId= event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemId){
            splitId=itemId.split('-');
            type=splitId[0];
            ID=parseInt(splitId[1]);
            budgetController.deleteItem(type,ID);
            UICtrl.deleteListItem(itemId);
            updateBudget();
            updatePercentages();

        }
    };
    return{
        init:function(){
            console.log('Appliction has started');
            UICtrl.displayMonth();
            UICtrl.displayBudget({budget:0,
                                  totalInc:0,
                                  totalExp:0,
                                  precentage:-1});
            setupEventListeners();
        }
    }
}
               )(budgetController,UIController);


controller.init();