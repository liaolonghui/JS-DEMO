$(function(){
  //加载数据的方法
  function loadDate(){
    var collection = localStorage.getItem('todo');
    if(collection){
      return JSON.parse(collection);
    }else{
      return [];
    }
  }
  //保存数据的方法
  function saveDate(data){
    localStorage.setItem('todo',JSON.stringify(data));
  }

  //加载网页数据
  load();
  function load(){
    var todoCount = 0;
    var doneCount = 0;
    var doneStr = '';
    var todoStr = '';
    var todoList = loadDate();//获取当前的todoList数据
    if(todoList && todoList.length>0){
      //有数据
      todoList.forEach(function(data,i){
        if(data.done){
          //已经完成
          doneStr += `
            <li>
              <input type="checkbox" index=${i} checked="checked">
              <p id="p-${i}">${data.title}</p>
              <a href="JavaScript:;">-</a>
            </li>
          `;
          doneCount++;
        }else{
          //正在进行
          todoStr += `
            <li>
              <input type="checkbox" index=${i}>
              <p id="p-${i}">${data.title}</p>
              <a href="JavaScript:;">-</a>
            </li>
          `;
          todoCount++;
        }
        $('#todolist').html(todoStr);
        $('#donelist').html(doneStr);
        $('#todocount').html(todoCount);
        $('#donecount').html(doneCount);
      });
    }else{
      //无数据
      $('#todolist').html('');
      $('#donelist').html('');
      $('#todocount').html(todoCount);
      $('#donecount').html(doneCount);
    }
  }

  //添加数据的方法
  $('#title').keydown(function(event){
    if(event.keyCode === 13){
      //获取输入框中的值
      var val = $(this).val();
      if(!val){
        alert('不能为空，请重新输入');
      }else{
        var data = loadDate();      //获取数据再修改数据，最后再保存。
        data.unshift({
          title: val,
          done: false
        });
        //清空input输入框中的值
        $(this).val('');
        //保存数据
        saveDate(data);
        //更新
        load();
      }
    }
  });

  //删除  使用事件代理的方式
  $('#todolist').on('click','a',function(){
    var i = $(this).parent().children('input[type=checkbox]').attr('index');
    var data = loadDate();    //删除同理，先获取数据再删除数据，最后再保存数据。
    data.splice(i,1);
    saveDate(data);
    load();
  });
  $('#donelist').on('click','a',function(){
    var i = $(this).parent().children('input[type=checkbox]').attr('index');
    var data = loadDate();
    data.splice(i,1);
    saveDate(data);
    load();
  });

  //更新数据
  $('#todolist').on('click','input[type=checkbox]',function(){
    //更新数据
    var i = parseInt($(this).attr('index'));
    update(i, 'done', true);
  });
  $('#donelist').on('click','input[type=checkbox]',function(){
    //更新数据
    var i = parseInt($(this).attr('index'));
    update(i, 'done', false);
  });
  function update(i, key, value){
    var data = loadDate();    //更新也是先获取数据再修改数据，最后再保存数据。
    var todo = data.splice(i,1)[0];//此时取到被删除数组的[0]位置处的对象。
    todo[key] = value;
    data.splice(i,0,todo);
    saveDate(data);
    load();
  }

  //编辑操作
  $('#todolist').on('click','p',function(){
    var i = $(this).parent().children('input[type=checkbox]').attr('index');
    var title = $(this).html();
    var $p = $(this);
    $p.html(`
        <input type="text" id="input-${i}" value="${title}" />
    `);
    //选中(此时不使用jquery对象，使用dom对象的setSelectionRange()方法)
    $(`#input-${i}`)[0].setSelectionRange(0,$(`#input-${i}`).val().length);
    //获取焦点
    $(`#input-${i}`).focus();
    //失去焦点就保存更改的数据
    $(`#input-${i}`).blur(function(){
      if($(this).val().length === 0){
        $p.html(title);
        alert('内容不能为空');
      }else{
        update(i, 'title', $(this).val());
      }
    });
  });

})
