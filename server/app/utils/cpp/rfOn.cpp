#include <node.h>
#include "visa.h"

using namespace v8;

void rfOn(const FunctionCallbackInfo<Value> &args)
{
    int generatorNumber = int(args[0].As<Number>()->Value());

    //* C++ starts here

    ViSession defaultRM, viMXG;
    ViStatus viStatus = 0;

    viStatus = viOpenDefaultRM(&defaultRM);
    if (generatorNumber == 2)
    {
        viStatus = viOpen(defaultRM, "GPIB0::19::INSTR", VI_NULL, VI_NULL, &viMXG);
    }
    else
    {
        viStatus = viOpen(defaultRM, "GPIB0::18::INSTR", VI_NULL, VI_NULL, &viMXG);
    }

    if (viStatus)
        return;

    // Turns RF on
    viPrintf(viMXG, "OUTP ON\n");

    viClose(viMXG);     // closes session
    viClose(defaultRM); // closes default session

    //* C++ ends here
}

void init(Local<Object> exports, Local<Object> method)
{
    NODE_SET_METHOD(method, "exports", rfOn);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, init);