import java.util.Random;
import java.util.Scanner;
import java.util.Arrays;

public class Yacht{
    private Random rand = new Random();
    private Scanner scanner = new Scanner(System.in);

    private enum e_categories{
        Ones,Twos,Threes,Fours,Fives,Sixes,Bonus,Full_House,Four_of_a_Kind,Little_Straight,Big_Straight,Choice,Yacht
    }

    //main game engine method, could be broken up into phase-based methods for readability
    public void playGame(){
        //initialize game parameters
        int numPlayers;
        System.out.println("How many players (1-9)?");
        numPlayers = getInput(1,9); //no need for large number of players

        //initialize round variables
        System.out.println("Beginning game with "+numPlayers+" players!");
        //design choice to use array since all sizes are fixed.
        //ArrayList could have been used later for available scoring categories, but array is best for dice and scores
        Dice[] dice = new Dice[] {new Dice(),new Dice(),new Dice(),new Dice(),new Dice()};
        int[][] scores = new int[numPlayers][13];
        for(int a=0;a<numPlayers;a++){ //un-filled score is stored as -1, displayed as "-"
            for(int b=0;b<scores[a].length;b++){
                scores[a][b]=-1;
            }
        }
        //main gameplay loop
        int rollCount=0;
        int choice;
        int[] diceValues;
        boolean[] categories=null;
        boolean zeroFlag=false;
        for(int round=0; round<12; round++){ //round loop
            System.out.println("---------------------------------------");
            System.out.println("Round "+round+"\n");
            rollCount=0;
            for(int player=0; player<numPlayers; player++){ //player turn
                printScore(scores,player);
                for(Dice d:dice){d.toRoll=true;d.fixed=false;}
                rollCount=0;
                while(rollCount<3){
                    for(Dice d:dice){
                        if(d.toRoll){d.value = rand.nextInt(6)+1;}
                    }                 
                    ++rollCount;
                    System.out.print("Roll "+rollCount+". ");printDice(dice,false);
                    if(rollCount<3 && !chooseDice(dice))break; //don't reroll if all dice are kept, cannot choose on last roll
                }
                diceValues = new int[] {dice[0].value,dice[1].value,dice[2].value,dice[3].value,dice[4].value};
                categories = calculateRollOptions(diceValues,scores[player]);
                zeroFlag=false;
                if(categories !=null){
                    System.out.println("Please choose a category to score in.\nAvailable options:");
                }else{
                    System.out.println("No Matching options, choose a category to zero in.\nAvailable options:");
                    zeroFlag=true;
                    categories = new boolean[13];
                    for(int a=0; a<categories.length; a++){
                        if(a==6)continue; //skip bonus category
                        categories[a]=(scores[player][a]<0);
                    }
                }
                //display available categories               
                for(Enum e: e_categories.values()){
                    if(categories[e.ordinal()]){
                        System.out.println("\tOption "+(e.ordinal()+1)+": "+e.name());
                    }
                }
                choice = getInputForScores(categories);
                if(!zeroFlag){
                    setScore(choice,calculateRollScore(choice,diceValues),scores[player]);
                }else{
                    setScore(choice,0,scores[player]);
                }
                if(player!=numPlayers-1)System.out.println();
            }
        }
        //display final score
        System.out.println("---------------------------------------");
        System.out.println("Final Scores:");
        printScore(scores,-1);

        //replay or exit
        System.out.println("Would you like to play again?\n\t1. Yes\n\t2. No");
        if(getInput(1,2)==1){
            System.out.println("\n\n\n\n");
            playGame();
        }else{
            System.out.println("Thank you for playing!");
        }
    }

    //Separate menu to allow flexibility of input types, this implementation uses command line
    //returns menu code for choice, input is checked for validity here
    public int getInput(int minValue,int maxVal){
        int selection = 0;
        while(true){
            try{
                selection = scanner.nextInt();
                if(selection>=minValue && selection<=maxVal) return  selection;
                System.out.println("Please try again...");
            }catch(Exception e){
                continue;
            }
        }
    }

    //acceptable input values have to be within mask array range and hit a true value
    private int getInputForScores(boolean[] mask){
        int selection = 0;
        while(true){
            try{
                selection = scanner.nextInt()-1;
                if(selection >= 0 || selection < mask.length){
                    if(mask[selection])return selection;
                }
                System.out.println("Please try again...");
            }catch(Exception e){
                continue;
            }
        }
    }

    //allows player to choose which dice to keep, meaning the rest will get rerolled
    private boolean chooseDice(Dice[] dice){
        int in; boolean reroll=false;
        //could add extra boolean flag to Dice class to allow for the player to rescind selection before commit
        System.out.println("Select which dice to keep, enter [1-5] to select dice or [0] when finished.");
        while(true){
            System.out.print("Dice: ");printDice(dice,true);
            in = getInput(0,5);
            if(in==0){
                break;
            }else{
                if(!dice[in-1].fixed)dice[in-1].toRoll^=true;
            }
        }
        
        for(Dice d:dice){
            if(d.toRoll){
                reroll= true;
            }else{
                d.fixed=true;
            }
        }
        return reroll; //returns false when all dice are fixed
    }

    //based on the dice rolls, returns list of applicable scoring categories, returns null if there are none
    private boolean[] calculateRollOptions(int[] dice,int[] scores){
        boolean[] flags = new boolean[13];
        boolean f=false;
        //ones through sixes
        for(int i=0; i<6; i++){
            if(scores[i]<0){
                if(calculateRollOptionNumeric(i+1,dice)){
                    flags[i]=true;f=true;
                }
            }
        }
        //full house
        if(scores[7]<0){
            int first=-1; int firstCount=0;
            int second=-1; int secondCount=0;
            for(Integer d:dice){
                if(d == first){
                    firstCount++;
                }else if(d==second){
                    secondCount++;
                }else if(first==-1){
                    first=d; firstCount++;
                }else{
                    if(second==-1 && d!=first){
                        second=d; secondCount++;
                    }else{ 
                        if(d != first && d != second){ //third number detected
                            break;
                        }
                    }
                }
            }
            if(firstCount==3&&secondCount==2 || secondCount==3&&firstCount==2){
                flags[7]=true;f=true;
            }
        }
        //four-of-a-kind
        if(scores[8]<0){
            int primary; //primary is a double match       
            if(dice[0]==dice[1]){
                primary = dice[0];
            }if(dice[0]==dice[2]){
                primary = dice[0];
            }else if(dice[1] == dice[2]){
                primary = dice[1];
            }else{
                primary = -1; //first 3 dice are unique, thus no four-of-a-kind
            }

            if(primary!=-1){
                boolean b1=false;//flag for first mismatch
                boolean b2=false;//flag for second mismatch
                for(Integer d:dice){
                    if(d!=primary){
                        if(b1){
                            b2=true;
                            break;
                        }else{
                            b1=true; //two numbers did not match primary
                        }
                    }
                }
                if(!b2){
                    flags[8]=true;f=true;
                }
            }
        }
        
        Arrays.sort(dice);
        //little straight
        if(scores[9]<0){
            if(dice[0]==1 && dice[1]==2 && dice[2]==3
                && dice[3]==4 && dice[4]==5){
                    flags[9]=true;f=true;
                }
        }
        //big straight
        if(scores[10]<0){
            if(dice[0]==2 && dice[1]==3 && dice[2]==4
                && dice[3]==5 && dice[4]==6){
                    flags[10]=true;f=true;
                }
        }
        //choice
        if(scores[11]<0){
            flags[11]=true;f=true;
        }
        //yacht
        if(scores[12]<0){
            boolean hasYacht=true;
            for(Integer d:dice){
                if(d != dice[0]){
                    hasYacht=false;
                    break;
                }
            }
            if(hasYacht){
                flags[12]=true;f=true;
            }
        }
        if(f)return flags;
        return null;
    }

    //helper method to avoid repetition
    private boolean calculateRollOptionNumeric(int number,int[] dice){
        for(Integer d:dice){
            if(d==number){
                return true;
            }
        }
        return false;
    }

    //computes the score of a given category and dice rolls
    private int calculateRollScore(int category,int[] dice){
        int score=0;
        switch(category){
            case 0: //ones
                score=calculateNumericScore(1, dice,false);break;
            case 1: //twos
                score=calculateNumericScore(2, dice,false);break;
            case 2: //threes
                score=calculateNumericScore(3, dice,false);break;
            case 3: //fours
                score=calculateNumericScore(4, dice,false);break;
            case 4: //fives
                score=calculateNumericScore(5, dice,false);break;
            case 5: //sixes
                score=calculateNumericScore(6, dice,false);break;
            case 7: //full house
                for(Integer d:dice){
                    score+=d;
                }break;
            case 8: //four-of-a-kind
                if(dice[0]==dice[1] || dice[0]==dice[2]){
                    score=calculateNumericScore(dice[0],dice,true);
                }else{
                    score=calculateNumericScore(dice[1],dice,true);
                }break;
            case 9: //small straight
                score=30;break;
            case 10://large straight
                score=30;break;
            case 11://choice
                for(Integer d:dice){
                    score+=d;
                }break;
            case 12://yacht
                score=50;break;
                
        }
        return score;
    }

    //helper method to reduce repetition, also overloaded with extra flag
    private int calculateNumericScore(int number, int[] dice,boolean flag_4oak){
        int score=0;
        int count_4oak=0;//only count 4 matching numbers in 4 of a kind, edge case
        for(int i=0; i<dice.length; i++){
            if(dice[i]==number){
                score+=dice[i];
                if(flag_4oak && ++count_4oak==4)break;
            }
        }
        return score;
    }

    //helper method mostly for bonus score subroutine
    private void setScore(int category,int score, int[] scores){
        scores[category] = score;
        if(category<6 && scores[6]<0){ //check if bonus has been reached when setting categories 0-5
            int subtotal=0;
            for(int i=0; i<6; i++){
                if(scores[i]<0)return; //short-circuit when scoring is incomplete
                subtotal+=scores[i];               
            }
            if(subtotal>62){
                scores[6]=30;
            }else{
                scores[6]=0;
            }
        }
    }

    //displays scores for a given player, -1 for all players
    private void printScore(int[][] scores, int playerNum){
        int total=0;
        if(playerNum==-1){ //print all players
            for(int i=0; i<scores.length; i++){
                System.out.print("Player "+(i+1)+". [");
                total=0;
                for(int j=0; j<scores[i].length; j++){
                    if(j==6)System.out.print("(");
                    if(scores[i][j]==-1){
                        System.out.print("-");
                    }else{
                        System.out.print(scores[i][j]);
                        total+=scores[i][j];
                    }
                    if(j==6)System.out.print(")");
                    if(j!=scores[0].length-1)System.out.print(",");
                }
                System.out.println("]\tTotal:"+total);
            }
        }else{ //print specific player
            int i=playerNum;
            System.out.print("Player "+(i+1)+". [");
            for(int j=0; j<scores[i].length; j++){
                if(j==6)System.out.print("(");
                if(scores[i][j]==-1){
                    System.out.print("-");
                }else{
                    System.out.print(scores[i][j]);
                    total+=scores[i][j];
                }
                if(j==6)System.out.print(")");
                if(j!=scores[0].length-1)System.out.print(",");
            }
            System.out.println("]\tTotal:"+total);
        }
    }

    //prints dice rolls with () for dice that have not yet been chosen
    private void printDice(Dice[] dice,boolean flag){
        System.out.print("[");
        for(int i=0; i<dice.length; i++){
            if(flag && dice[i].toRoll)System.out.print("(");
            if(flag && !dice[i].fixed)System.out.print("*");
            System.out.print(dice[i].value);
            if(flag && dice[i].toRoll)System.out.print(")");
            if(i!=dice.length-1)System.out.print(",");
        }
        System.out.println("]");
    }

    public static void main(String[] args){
        Yacht yacht = new Yacht();
        System.out.println("Welcome to Yacht, the dice game!\nWould you like to play the game, or run unit tests?"
                                +"\n\t1. PlayGame\n\t2. Run Tests");
        if(yacht.getInput(1,2)==1){
            yacht.playGame();
        }else{
            UnitTests tester = yacht.new UnitTests();
            System.out.println("The following unit test categories are available:\n\tAll\n\tCategory Detection\n\tScore Calculation");
            int i = yacht.getInput(1,3);
            if(i==2){
                tester.testCategoryDetection();
            }else if(i==3){
                tester.testScoreCalculation();
            }else{
                tester.testCategoryDetection();
                tester.testScoreCalculation();
            }
        }
        
    }
//--------------------------------------------------------------------------------
    //value-flag pair wrapper
    private class Dice{ 
        public int value;
        public boolean toRoll;
        public boolean fixed;
    }

    private class UnitTests{
        //PASS: result matched expected
        //FAIL: result did not match expected for specific category
        //FAILED OTHER CATEGORY: result matched expected in the specific category, but not 100% match
            //unfortunately does not explain which other category failed - beyond scope of project
        public void testCategoryDetection(){
            int[] dice;
            boolean[] expected,result;
            int[] scores = new int[13];
            for(int i=0; i<scores.length; i++){
                scores[i]=-1;
            }

            //Full House
            expected = new boolean[] {true,false,false,true,false,false, false, true,false,false,false,true,false};
            System.out.println("Testing Full House Detection (Same Expected Set)");
                System.out.print("\tTest Array: [1,1,1,4,4]");
                    dice = new int[]{1,1,1,4,4}; //sorted 3-2
                    result = calculateRollOptions(dice, scores);
                    if(Arrays.equals(expected,result)){System.out.println("\tPASS");}else{
                        System.out.print("\tFAIL");
                        if(result[7])System.out.print("ED OTHER CATEGORY");
                        System.out.println();
                    }
                System.out.print("\tTest Array: [1,4,1,1,4]");
                    dice = new int[]{1,4,1,1,4}; //randomized
                    result = calculateRollOptions(dice, scores);
                    if(Arrays.equals(expected,result)){System.out.println("\tPASS");}else{
                        System.out.print("\tFAIL");
                        if(result[7])System.out.print("ED OTHER CATEGORY");
                        System.out.println();
                    }
                System.out.print("\tTest Array: [1,4,1,4,1]");    
                    dice = new int[]{1,4,1,4,1}; //randomized
                    result = calculateRollOptions(dice, scores);
                    if(Arrays.equals(expected,result)){System.out.println("\tPASS");}else{
                        System.out.print("\tFAIL");
                        if(result[7])System.out.print("ED OTHER CATEGORY");
                        System.out.println();
                    }
                System.out.print("\tTest Array: [4,4,1,1,1]");
                    dice = new int[]{4,4,1,1,1}; //sorted 2-3
                    result = calculateRollOptions(dice, scores);
                    if(Arrays.equals(expected,result)){System.out.println("\tPASS");}else{
                        System.out.print("\tFAIL");
                        if(result[7])System.out.print("ED OTHER CATEGORY");
                        System.out.println();
                    }
            
            //Yacht
            System.out.println("Testing Yacht Detection, Contains Four-of-a-Kind");
                System.out.print("\tTest Array: [2,2,2,2,2]");
                    expected = new boolean[] {false,true,false,false,false,false, false, false,true,false,false,true,true};
                    dice = new int[]{2,2,2,2,2}; //2s
                    result = calculateRollOptions(dice, scores);
                    if(Arrays.equals(expected,result)){System.out.println("\tPASS");}else{
                        System.out.print("\tFAIL");
                        if(result[12])System.out.print("ED OTHER CATEGORY");
                        System.out.println();
                    }
                System.out.print("\tTest Array: [5,5,5,5,5]");
                    expected = new boolean[] {false,false,false,false,true,false, false, false,true,false,false,true,true};
                    dice = new int[]{5,5,5,5,5}; //5s
                    result = calculateRollOptions(dice, scores);
                    if(Arrays.equals(expected,result)){System.out.println("\tPASS");}else{
                        System.out.print("\tFAIL");
                        if(result[12])System.out.print("ED OTHER CATEGORY");
                        System.out.println();
                    }
            //Four-of-a-Kind, 4 matches
            System.out.println("Testing Four-of-a-Kind Detection");
                System.out.print("\tTest Array: [6,5,5,5,5]");
                    expected = new boolean[] {false,false,false,false,true,true, false, false,true,false,false,true,false};
                    dice = new int[]{6,5,5,5,5}; //sorted 1-4
                    result = calculateRollOptions(dice, scores);
                    if(Arrays.equals(expected,result)){System.out.println("\tPASS");}else{
                        System.out.print("\tFAIL");
                        if(result[8])System.out.print("ED OTHER CATEGORY");
                        System.out.println();
                    }
                System.out.print("\tTest Array: [4,4,4,4,1]");
                    expected = new boolean[] {true,false,false,true,false,false, false, false,true,false,false,true,false};
                    dice = new int[]{4,4,4,4,1}; //sorted 4-1
                    result = calculateRollOptions(dice, scores);
                    if(Arrays.equals(expected,result)){System.out.println("\tPASS");}else{
                        System.out.print("\tFAIL");
                        if(result[8])System.out.print("ED OTHER CATEGORY");
                        System.out.println();
                    }
                System.out.print("\tTest Array: [2,2,2,3,2]");
                    expected = new boolean[] {false,true,true,false,false,false, false, false,true,false,false,true,false};
                    dice = new int[]{2,2,2,3,2}; //mixed
                    result = calculateRollOptions(dice, scores);
                    if(Arrays.equals(expected,result)){System.out.println("\tPASS");}else{
                        System.out.print("\tFAIL");
                        if(result[8])System.out.print("ED OTHER CATEGORY");
                        System.out.println();
                    }
            //Little Straight
            expected = new boolean[] {true,true,true,true,true,false, false, false,false,true,false,true,false};
            System.out.println("Testing Little Straight Detection (Same Expected Set)");
                System.out.print("\tTest Array: [1,2,3,4,5]");
                    dice = new int[]{1,2,3,4,5}; //sorted
                    result = calculateRollOptions(dice, scores);
                    if(Arrays.equals(expected,result)){System.out.println("\tPASS");}else{
                        System.out.print("\tFAIL");
                        if(result[9])System.out.print("ED OTHER CATEGORY");
                        System.out.println();
                    }
                System.out.print("\tTest Array: [5,4,3,2,1]");
                    dice = new int[]{5,4,3,2,1}; //reverse sorted
                    result = calculateRollOptions(dice, scores);
                    if(Arrays.equals(expected,result)){System.out.println("\tPASS");}else{
                        System.out.print("\tFAIL");
                        if(result[9])System.out.print("ED OTHER CATEGORY");
                        System.out.println();
                    }
                System.out.print("\tTest Array: [2,4,1,5,3]");
                    dice = new int[]{2,4,1,5,3}; //randomized
                    result = calculateRollOptions(dice, scores);
                    if(Arrays.equals(expected,result)){System.out.println("\tPASS");}else{
                        System.out.print("\tFAIL");
                        if(result[9])System.out.print("ED OTHER CATEGORY");
                        System.out.println();
                    }
            //Big Straight
            expected = new boolean[] {false,true,true,true,true,true, false, false,false,false,true,true,false};
            System.out.println("Testing Big Straight Detection (Same Expected Set)");
                System.out.print("\tTest Array: [2,3,4,5,6]");
                    dice = new int[]{2,3,4,5,6}; //sorted
                    result = calculateRollOptions(dice, scores);
                    if(Arrays.equals(expected,result)){System.out.println("\tPASS");}else{
                        System.out.print("\tFAIL");
                        if(result[10])System.out.print("ED OTHER CATEGORY");
                        System.out.println();
                    }
                System.out.print("\tTest Array: [6,5,4,3,2]");
                    dice = new int[]{6,5,4,3,2}; //reverse sorted
                    result = calculateRollOptions(dice, scores);
                    if(Arrays.equals(expected,result)){System.out.println("\tPASS");}else{
                        System.out.print("\tFAIL");
                        if(result[10])System.out.print("ED OTHER CATEGORY");
                        System.out.println();
                    }
                System.out.print("\tTest Array: [2,4,6,5,3]");
                    dice = new int[]{2,4,6,5,3}; //randomized
                    result = calculateRollOptions(dice, scores);
                    if(Arrays.equals(expected,result)){System.out.println("\tPASS");}else{
                        System.out.print("\tFAIL");
                        if(result[10])System.out.print("ED OTHER CATEGORY");
                        System.out.println();
                    }
        }
        public void testScoreCalculation(){
            System.out.println("TODO: needs implementation");
            //Numeric scoring and fixed scoring are trivial; no tests needed
            //Bonus Score
                //test all 0s               <- min test
                //test 62                   <- 1 less
                //test 63                   <- threshold test
                //test 64                   <- 1 more
                //test max numeric score    <- max test
            //Four-of-a-Kind - make sure it does not cound 5th match too
                //one normal test
                //one 5 of a kind edge case
        }
    }
}