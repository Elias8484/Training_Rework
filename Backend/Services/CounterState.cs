namespace Backend.Services;

public class CounterState
{
    public int Value { get; private set; } = 0;

    public int Increment()
    {
        Value++;
        return Value;
    }
}
