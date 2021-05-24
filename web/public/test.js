//ported from Java, tests category detection
/*let testMethods = function(){
  var dice;
  var expected; var result;

  //Full House
  expected = [true,false,false,true,false,false, false, true,false,false,false,true,false]
  console.log("Testing Full House Detection (Same Expected Set)");
      console.log("\tTest Array: [1,1,1,4,4]");
          dice = [1,1,1,4,4]; //sorted 3-2
          result = this.calculateRollOptions(dice);
          if(this.equals(expected,result)){console.log("\tPASS");}else{
              console.log("\tFAIL");
              if(result[7])console.log("ED OTHER CATEGORY");
              console.log();
          }
      console.log("\tTest Array: [1,4,1,1,4]");
          dice = [1,4,1,1,4]; //randomized
          result = this.calculateRollOptions(dice);
          if(this.equals(expected,result)){console.log("\tPASS");}else{
              console.log("\tFAIL");
              if(result[7])console.log("ED OTHER CATEGORY");
              console.log();
          }
      console.log("\tTest Array: [1,4,1,4,1]");
          dice = [1,4,1,4,1]; //randomized
          result = this.calculateRollOptions(dice);
          if(this.equals(expected,result)){console.log("\tPASS");}else{
              console.log("\tFAIL");
              if(result[7])console.log("ED OTHER CATEGORY");
              console.log();
          }
      console.log("\tTest Array: [4,4,1,1,1]");
          dice = [4,4,1,1,1]; //sorted 2-3
          result = this.calculateRollOptions(dice);
          if(this.equals(expected,result)){console.log("\tPASS");}else{
              console.log("\tFAIL");
              if(result[7])console.log("ED OTHER CATEGORY");
              console.log();
          }

  //Yacht
  console.log("Testing Yacht Detection, Contains Four-of-a-Kind");
      console.log("\tTest Array: [2,2,2,2,2]");
          expected = [false,true,false,false,false,false, false, false,true,false,false,true,true];
          dice = [2,2,2,2,2]; //2s
          result = this.calculateRollOptions(dice);
          if(this.equals(expected,result)){console.log("\tPASS");}else{
              console.log("\tFAIL");
              if(result[12])console.log("ED OTHER CATEGORY");
              console.log();
          }
      console.log("\tTest Array: [5,5,5,5,5]");
          expected = [false,false,false,false,true,false, false, false,true,false,false,true,true];
          dice = [5,5,5,5,5]; //5s
          result = this.calculateRollOptions(dice);
          if(this.equals(expected,result)){console.log("\tPASS");}else{
              console.log("\tFAIL");
              if(result[12])console.log("ED OTHER CATEGORY");
              console.log();
          }
  //Four-of-a-Kind, 4 matches
  console.log("Testing Four-of-a-Kind Detection");
      console.log("\tTest Array: [6,5,5,5,5]");
          expected = [false,false,false,false,true,true, false, false,true,false,false,true,false];
          dice = [6,5,5,5,5]; //sorted 1-4
          result = this.calculateRollOptions(dice);
          if(this.equals(expected,result)){console.log("\tPASS");}else{
              console.log("\tFAIL");
              if(result[8])console.log("ED OTHER CATEGORY");
              console.log();
          }
      console.log("\tTest Array: [4,4,4,4,1]");
          expected = [true,false,false,true,false,false, false, false,true,false,false,true,false];
          dice = [4,4,4,4,1]; //sorted 4-1
          result = this.calculateRollOptions(dice);
          if(this.equals(expected,result)){console.log("\tPASS");}else{
              console.log("\tFAIL");
              if(result[8])console.log("ED OTHER CATEGORY");
              console.log();
          }
      console.log("\tTest Array: [2,2,2,3,2]");
          expected = [false,true,true,false,false,false, false, false,true,false,false,true,false];
          dice = [2,2,2,3,2]; //mixed
          result = this.calculateRollOptions(dice);
          if(this.equals(expected,result)){console.log("\tPASS");}else{
              console.log("\tFAIL");
              if(result[8])console.log("ED OTHER CATEGORY");
              console.log();
          }
  //Little Straight
  expected = [true,true,true,true,true,false, false, false,false,true,false,true,false];
  console.log("Testing Little Straight Detection (Same Expected Set)");
      console.log("\tTest Array: [1,2,3,4,5]");
          dice = [1,2,3,4,5]; //sorted
          result = this.calculateRollOptions(dice);
          if(this.equals(expected,result)){console.log("\tPASS");}else{
              console.log("\tFAIL");
              if(result[9])console.log("ED OTHER CATEGORY");
              console.log();
          }
      console.log("\tTest Array: [5,4,3,2,1]");
          dice = [5,4,3,2,1]; //reverse sorted
          result = this.calculateRollOptions(dice);
          if(this.equals(expected,result)){console.log("\tPASS");}else{
              console.log("\tFAIL");
              if(result[9])console.log("ED OTHER CATEGORY");
              console.log();
          }
      console.log("\tTest Array: [2,4,1,5,3]");
          dice = [2,4,1,5,3]; //randomized
          result = this.calculateRollOptions(dice);
          if(this.equals(expected,result)){console.log("\tPASS");}else{
              console.log("\tFAIL");
              if(result[9])console.log("ED OTHER CATEGORY");
              console.log();
          }
  //Big Straight
  expected = [false,true,true,true,true,true, false, false,false,false,true,true,false];
  console.log("Testing Big Straight Detection (Same Expected Set)");
      console.log("\tTest Array: [2,3,4,5,6]");
          dice = [2,3,4,5,6]; //sorted
          result = this.calculateRollOptions(dice);
          if(this.equals(expected,result)){console.log("\tPASS");}else{
              console.log("\tFAIL");
              if(result[10])console.log("ED OTHER CATEGORY");
              console.log();
          }
      console.log("\tTest Array: [6,5,4,3,2]");
          dice = [6,5,4,3,2]; //reverse sorted
          result = this.calculateRollOptions(dice);
          if(this.equals(expected,result)){console.log("\tPASS");}else{
              console.log("\tFAIL");
              if(result[10])console.log("ED OTHER CATEGORY");
              console.log();
          }
      console.log("\tTest Array: [2,4,6,5,3]");
          dice = [2,4,6,5,3]; //randomized
          result = this.calculateRollOptions(dice);
          if(this.equals(expected,result)){console.log("\tPASS");}else{
              console.log("\tFAIL");
              if(result[10])console.log("ED OTHER CATEGORY");
              console.log();
          }
}*/
