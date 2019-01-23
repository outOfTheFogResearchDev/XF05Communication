#include <node.h>
#include "visa.h"

using namespace v8;

void setAnalyzer(const FunctionCallbackInfo<Value> &args)
{
    Isolate *isolate = args.GetIsolate();
    int frequency = args[0].As<Number>()->Value();

    //* C++ starts here

    ViSession defaultRM, viMXA;
    ViStatus viStatus = 0;

    viStatus = viOpenDefaultRM(&defaultRM);
    viStatus = viOpen(defaultRM, "GPIB0::16::INSTR", VI_NULL, VI_NULL, &viMXA);

    if (viStatus)
        return;

    std::string res;

    // Initiate a sweep
    viPrintf(viMXA, "INIT:IMM;*WAI\n");

    // Get the current output in string form, to be converted to a number in JS
    viQueryf(viMXA, "CALC:MARKER1:Y?\n", "%t", &res);

    viClose(viMXA);     // closes session
    viClose(defaultRM); // closes default session

    //* C++ ends here

    args.GetReturnValue().Set(String::NewFromUtf8(isolate, res.c_str()));
}

void init(Local<Object> exports, Local<Object> method)
{
    NODE_SET_METHOD(method, "exports", setAnalyzer);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, init);