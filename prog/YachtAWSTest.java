package yacht;

import com.amazonaws.Yacht;
import static org.junit.Assert.*;

import java.util.Arrays;

import org.junit.BeforeClass;
import org.junit.Test;

//extracted tests from Yacht.java and created JUnit tests
public class YachtTest {
	private static Yacht yacht = new Yacht();
	private static int[] dice,scores;
	private static boolean[] expected,result;
	
	@BeforeClass
	public static void beforeClass() {
		scores = new int[13];
		Arrays.fill(scores, -1);
	}
	
	@Test
	public void calculateRollOptionsTestFullHouse() {
		expected = new boolean[] {true,false,false,true,false,false, false, true,false,false,false,true,false};
        dice = new int[]{1,1,1,4,4}; //sorted 3-2
        result = yacht.testRollOptions(dice, scores);
        assertArrayEquals(expected,result);

        dice = new int[]{1,4,1,1,4}; //randomized
        result = yacht.testRollOptions(dice, scores);
        assertArrayEquals(expected,result);
         
        dice = new int[]{1,4,1,4,1}; //randomized
        result = yacht.testRollOptions(dice, scores);
        assertArrayEquals(expected,result);

        dice = new int[]{4,4,1,1,1}; //sorted 2-3
        result = yacht.testRollOptions(dice, scores);
        assertArrayEquals(expected,result);
	}

	@Test
	public void calculateRollOptionsTestYacht() {
		expected = new boolean[] {false,true,false,false,false,false, false, false,true,false,false,true,true};
        dice = new int[]{2,2,2,2,2}; //2s
        result = yacht.testRollOptions(dice, scores);
        assertArrayEquals(expected,result);
        
        expected = new boolean[] {false,false,false,false,true,false, false, false,true,false,false,true,true};
        dice = new int[]{5,5,5,5,5}; //5s
        result = yacht.testRollOptions(dice, scores);
        assertArrayEquals(expected,result);
	}

	@Test
	public void calculateRollOptionsTestFourOfKind() {
        expected = new boolean[] {false,false,false,false,true,true, false, false,true,false,false,true,false};
        dice = new int[]{6,5,5,5,5}; //sorted 1-4
        result = yacht.testRollOptions(dice, scores);
        assertArrayEquals(expected,result);
        
        expected = new boolean[] {true,false,false,true,false,false, false, false,true,false,false,true,false};
        dice = new int[]{4,4,4,4,1}; //sorted 4-1
        result = yacht.testRollOptions(dice, scores);
        assertArrayEquals(expected,result);
        
        expected = new boolean[] {false,true,true,false,false,false, false, false,true,false,false,true,false};
        dice = new int[]{2,2,2,3,2}; //mixed
        result = yacht.testRollOptions(dice, scores);
        assertArrayEquals(expected,result);
	}
	
	@Test
	public void calculateRollOptionsTestLittleStraight() {
        expected = new boolean[] {true,true,true,true,true,false, false, false,false,true,false,true,false};
        dice = new int[]{1,2,3,4,5}; //sorted
        result = yacht.testRollOptions(dice, scores);
        assertArrayEquals(expected,result);
        
        dice = new int[]{5,4,3,2,1}; //reverse sorted
        result = yacht.testRollOptions(dice, scores);
        assertArrayEquals(expected,result);
        
        dice = new int[]{2,4,1,5,3}; //randomized
        result = yacht.testRollOptions(dice, scores);
        assertArrayEquals(expected,result);
	}
	
	@Test
	public void calculateRollOptionsTestBigStraight() {
        expected = new boolean[] {false,true,true,true,true,true, false, false,false,false,true,true,false};
        dice = new int[]{2,3,4,5,6}; //sorted
        result = yacht.testRollOptions(dice, scores);
        assertArrayEquals(expected,result);
        
        dice = new int[]{6,5,4,3,2}; //reverse sorted
        result = yacht.testRollOptions(dice, scores);
        assertArrayEquals(expected,result);
        
        dice = new int[]{2,4,6,5,3}; //randomized
        result = yacht.testRollOptions(dice, scores);
        assertArrayEquals(expected,result);
	}
}
