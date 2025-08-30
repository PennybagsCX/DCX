pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SimpleDEX {
    address public tokenA;
    address public tokenB;
    uint256 public reserveA;
    uint256 public reserveB;

    constructor(address _tokenA, address _tokenB) {
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    function addLiquidity(uint256 amountA, uint256 amountB) external {
        require(amountA > 0 && amountB > 0, "Amounts must be positive");
        IERC20(tokenA).transferFrom(msg.sender, address(this), amountA);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountB);
        reserveA += amountA;
        reserveB += amountB;
    }

    function swap(address tokenIn, uint256 amountIn, uint256 minAmountOut) external {
        require(tokenIn == tokenA || tokenIn == tokenB, "Invalid token");
        require(amountIn > 0, "Amount must be positive");
        uint256 amountOut;
        if (tokenIn == tokenA) {
            amountOut = (amountIn * reserveB) / reserveA;
            require(amountOut >= minAmountOut, "Insufficient output");
            reserveA += amountIn;
            reserveB -= amountOut;
            IERC20(tokenA).transferFrom(msg.sender, address(this), amountIn);
            IERC20(tokenB).transfer(msg.sender, amountOut);
        } else {
            amountOut = (amountIn * reserveA) / reserveB;
            require(amountOut >= minAmountOut, "Insufficient output");
            reserveB += amountIn;
            reserveA -= amountOut;
            IERC20(tokenB).transferFrom(msg.sender, address(this), amountIn);
            IERC20(tokenA).transfer(msg.sender, amountOut);
        }
    }
}
