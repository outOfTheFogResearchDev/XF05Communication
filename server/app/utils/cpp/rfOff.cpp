#include <node.h>
#include "visa.h"

using namespace v8;

void rfOff(const FunctionCallbackInfo<Value> &args)
{
    int generatorNumber = int(args[0].As<Number>()->Value());

    //* C++ starts here

    ViSession defaultRM, viMXG;
    ViStatus viStatus = 0;

    viStatus = viOpenDefaultRM(&defaultRM);
    if (generatorNumber == 2)
    {
        viStatus = viOpen(defaultRM, "GPIB2::19::INSTR", VI_NULL, VI_NULL, &viMXG);
    }
    else
    {
        viStatus = viOpen(defaultRM, "GPIB2::18::INSTR", VI_NULL, VI_NULL, &viMXG);
    }

    if (viStatus)
        return;

    // Turns RF off
    viPrintf(viMXG, "OUTP OFF\n");

    viClose(viMXG);     // closes session
    viClose(defaultRM); // closes default session

    //* C++ ends here
}

void init(Local<Object> exports, Local<Object> method)
{
    NODE_SET_METHOD(method, "exports", rfOff);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, init);