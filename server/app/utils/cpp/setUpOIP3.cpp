#include <node.h>
#include "visa.h"

using namespace v8;

void setAnalyzer(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    double frequency = args[0].As<Number>()->Value();

    //* C++ starts here

    ViSession defaultRM, viMXA;
    ViStatus viStatus = 0;

    viStatus = viOpenDefaultRM(&defaultRM);
    viStatus = viOpen(defaultRM, "GPIB2::16::INSTR", VI_NULL, VI_NULL, &viMXA);

    if (viStatus)
        return;

    // Set band center and marker
    viPrintf(viMXA, "FREQ:CENTER %f GHz\n", frequency);
    viPrintf(viMXA, "FREQ:SPAN 200 KHz\n");
    viPrintf(viMXA, "DISP:WIND:TRAC:Y:RLEV -50 dBm\n");
    viPrintf(viMXA, "BAND 1 KHz\n");
    viPrintf(viMXA, "BAND:VID 100 Hz\n");

    viClose(viMXA);     // closes session
    viClose(defaultRM); // closes default session

    //* C++ ends here
}

void init(Local<Object> exports, Local<Object> method)
{
    NODE_SET_METHOD(method, "exports", setAnalyzer);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, init);