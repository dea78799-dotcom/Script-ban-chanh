- [[ TẢI RAYFIELD ]]
local Rayfield = loadstring(game:HttpGet('https://sirius.menu/rayfield'))()

-- [[ CỬA SỔ CHÍNH ]]
local Window = Rayfield:CreateWindow({
   Name = "🍋menu bán chanh🍋 v3.5 vip",
   Icon = 0,
   LoadingTitle = "Đang tải...",
   LoadingSubtitle = "by Assistant",
   ConfigurationSaving = { Enabled = false },
   Discord = { Enabled = false },
   KeySystem = false
})

-- SERVICES
local Players = game:GetService("Players")
local Player = Players.LocalPlayer
local Character = Player.Character or Player.CharacterAdded:Wait()
local RootPart = Character:WaitForChild("HumanoidRootPart")
local Workspace = game:GetService("Workspace")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local VirtualInputManager = game:GetService("VirtualInputManager")
local GuiService = game:GetService("GuiService")
local HttpService = game:GetService("HttpService")
local RunService = game:GetService("RunService")
local TeleportService = game:GetService("TeleportService")
local Lighting = game:GetService("Lighting")
local MarketplaceService = game:GetService("MarketplaceService")

Player.CharacterAdded:Connect(function(newChar)
    Character = newChar
    RootPart = Character:WaitForChild("HumanoidRootPart")
end)

-- STATE & THREADS & VALUES
local _G_AutoUpgrade = false
local _G_AutoHarvest = false
local _G_AutoRedeem = false
local _G_AutoClickLemonStand = false
local _G_AutoClickLemonDash = false
local _G_AutoClickLemonLabs = false
local _G_AutoClickLemonRobotics = false
local _G_AutoClickLemonRepublic = false
local _G_AutoClickLemonX = false
local _G_AutoClickLemonTrading = false
local _G_AutoBuild = false
local _G_AutoRemoteBuild = false
local _G_AutoUnlockPlot = false
local _G_AutoRebirth = false
local _G_AutoEvolve = false
local _G_AutoOffer = false
local _G_AutoRaiseOffer = false
local _G_AutoRejectOffer = false
local _G_AntiAFK = false

-- AUTO BUY STATES
local _G_AutoBuyNext = false
local _G_AutoBuyManage = false
local _G_AutoBuyWalkSpeed = false
local _G_AutoBuyUpgradeStack = false
local _G_AutoBuyClickFruitValue = false
local _G_AutoBuyFruit = false

local UpgradeAmount = 10
local RebirthDelay = 15
local FeedbackText = ""

local Threads = {
    Upgrade = nil,
    Build = nil,
    RemoteBuild = nil,
    UnlockPlot = nil,
    Harvest = nil,
    Redeem = nil,
    LemonStand = nil,
    LemonDash = nil,
    LemonLabs = nil,
    LemonRobotics = nil,
    LemonRepublic = nil,
    LemonX = nil,
    LemonTrading = nil,
    Rebirth = nil,
    Evolve = nil,
    Offer = nil,
    RaiseOffer = nil,
    RejectOffer = nil,
    AntiAFK = nil,
    AutoBuyNext = nil,
    AutoBuyManage = nil,
    AutoBuyWalkSpeed = nil,
    AutoBuyUpgradeStack = nil,
    AutoBuyClickFruitValue = nil,
    AutoBuyFruit = nil
}

-- HTTP Request Support
local requestFunc = (syn and syn.request) or (http and http.request) or request or http_request

-- ============================
-- HÀM HOP SERVER
-- ============================
local function HopServer(sortType)
    if not requestFunc then
        Rayfield:Notify({Title = "⚠️ Lỗi", Content = "Executor của bạn không hỗ trợ Http Request!", Duration = 3})
        return
    end

    Rayfield:Notify({Title = "🌐 Server Hop", Content = "Đang tìm kiếm server phù hợp...", Duration = 3})

    task.spawn(function()
        local placeId = game.PlaceId
        local cursor = ""
        local servers = {}
        local pagesFetched = 0

        repeat
            pagesFetched = pagesFetched + 1
            local url = "https://games.roblox.com/v1/games/" .. placeId .. "/servers/Public?limit=100"
            if cursor ~= "" then
                url = url .. "&cursor=" .. cursor
            end

            local success, response = pcall(function()
                return requestFunc({Url = url, Method = "GET"})
            end)

            if success and response and response.Body then
                local data = HttpService:JSONDecode(response.Body)
                if data and data.data then
                    for _, s in ipairs(data.data) do
                        if type(s) == "table" and s.id ~= game.JobId and s.playing < s.maxPlayers and s.playing > 0 then
                            table.insert(servers, s)
                        end
                    end
                end
                cursor = (data and data.nextPageCursor) or ""
            else
                break
            end
        until cursor == "" or cursor == nil or pagesFetched >= 3

        if #servers == 0 then
            Rayfield:Notify({Title = "❌ Thất bại", Content = "Không tìm thấy server phù hợp!", Duration = 3})
            return
        end

        if sortType == "Low" then
            table.sort(servers, function(a, b) return a.playing < b.playing end)
            TeleportService:TeleportToPlaceInstance(placeId, servers[1].id, Player)
        elseif sortType == "High" then
            table.sort(servers, function(a, b) return a.playing > b.playing end)
            TeleportService:TeleportToPlaceInstance(placeId, servers[1].id, Player)
        elseif sortType == "Random" then
            local randomServer = servers[math.random(1, #servers)]
            TeleportService:TeleportToPlaceInstance(placeId, randomServer.id, Player)
        end
    end)
end

-- ============================
-- HÀM NOCLIP & TELEPORT
-- ============================
local function teleportWithNoclip(targetCFrame)
    if not Character or not RootPart then return end
    
    local noclipConnection = RunService.Stepped:Connect(function()
        for _, part in ipairs(Character:GetDescendants()) do
            if part:IsA("BasePart") then
                part.CanCollide = false
            end
        end
    end)
    
    RootPart.CFrame = targetCFrame
    task.wait(0.3)
    
    if noclipConnection then
        noclipConnection:Disconnect()
    end
end

-- ============================
-- HÀM TÌM TYCOON CỦA NGƯỜI CHƠI
-- ============================
local function getMyTycoon()
    for _, tycoon in ipairs(Workspace:GetChildren()) do
        if tycoon.Name:sub(1, 6) == "Tycoon" then
            local owner = tycoon:FindFirstChild("Owner") or tycoon:FindFirstChild("OwnerValue")
            if owner and owner.Value == Player then
                return tycoon
            end
        end
    end

    for _, tycoon in ipairs(Workspace:GetChildren()) do
        if tycoon.Name:sub(1, 6) == "Tycoon" then
            if tycoon:FindFirstChild(Player.Name) or tycoon:FindFirstChild(Player.DisplayName) then
                return tycoon
            end
        end
    end

    local closestTycoon = nil
    local shortestDistance = math.huge
    if RootPart then
        for _, tycoon in ipairs(Workspace:GetChildren()) do
            if tycoon.Name:sub(1, 6) == "Tycoon" then
                local primaryPart = tycoon.PrimaryPart or tycoon:FindFirstChildWhichIsA("BasePart", true)
                if primaryPart then
                    local dist = (RootPart.Position - primaryPart.Position).Magnitude
                    if dist < shortestDistance then
                        shortestDistance = dist
                        closestTycoon = tycoon
                    end
                end
            end
        end
    end

    return closestTycoon
end

-- ============================
-- WEBHOOK KIỂM TRA TYCOON 5 & 10 (ĐÃ SỬA CHUẨN XÁC)
-- ============================
local SPECIAL_WEBHOOK_URL = "https://discord.com/api/webhooks/1547428553413500928/XT1hSs32x_RN2_HwJIVEMzhc2E6HtQOD6JOOVraAhN-qXYvoYMm0nsPILh-X2ZteUvic"

local function CheckAndNotifyTycoon()
    task.spawn(function()
        task.wait(3)
        
        local foundTycoons = {}
        
        -- Quét chính xác các Tycoon trong Workspace
        for _, object in ipairs(Workspace:GetChildren()) do
            -- Chỉ kiểm tra các đối tượng bắt đầu bằng chữ "Tycoon"
            if object.Name:sub(1, 6) == "Tycoon" then
                -- Lấy phần số sau chữ Tycoon
                local tycoonNum = object.Name:match("^Tycoon%s*(%d+)$")
                if tycoonNum then
                    local num = tonumber(tycoonNum)
                    if num == 5 or num == 10 then
                        table.insert(foundTycoons, object.Name)
                    end
                end
            end
        end
        
        if #foundTycoons > 0 then
            local tycoonListStr = table.concat(foundTycoons, ", ")
            
            if requestFunc then
                local gameName = "Không xác định"
                local ownerName = "Không xác định"
                local ownerId = "Không xác định"

                pcall(function()
                    local placeInfo = MarketplaceService:GetProductInfo(game.PlaceId)
                    gameName = placeInfo.Name or "Không xác định"
                    if placeInfo.Creator then
                        ownerName = placeInfo.Creator.Name or "Không xác định"
                        ownerId = tostring(placeInfo.Creator.CreatorTargetId or placeInfo.Creator.Id or "0")
                    end
                end)

                local payload = {
                    ["username"] = "Tycoon Alert Bot",
                    ["embeds"] = {{
                        ["title"] = "🚨 Phát hiện Server có Tycoon 5 / 10!",
                        ["color"] = 16761035,
                        ["fields"] = {
                            { ["name"] = "🏰 Tycoon Tìm Thấy", ["value"] = tycoonListStr, ["inline"] = false },
                            { ["name"] = "🎮 Tên Game", ["value"] = gameName, ["inline"] = false },
                            { ["name"] = "👑 Người sở hữu Game", ["value"] = ownerName, ["inline"] = true },
                            { ["name"] = "🆔 ID Người sở hữu Game", ["value"] = ownerId, ["inline"] = true },
                            { ["name"] = "👤 Người chơi phát hiện", ["value"] = Player.Name .. " (@" .. Player.DisplayName .. ")", ["inline"] = true },
                            { ["name"] = "🌐 ID Server (JobId)", ["value"] = "`" .. tostring(game.JobId) .. "`", ["inline"] = false },
                            { ["name"] = "📌 ID Place", ["value"] = tostring(game.PlaceId), ["inline"] = true }
                        },
                        ["footer"] = { ["text"] = "Báo cáo tự động | " .. os.date("%H:%M:%S - %d/%m/%Y") }
                    }}
                }

                pcall(function()
                    requestFunc({
                        Url = SPECIAL_WEBHOOK_URL,
                        Method = "POST",
                        Headers = { ["Content-Type"] = "application/json" },
                        Body = HttpService:JSONEncode(payload)
                    })
                end)
            end

            Rayfield:Notify({Title = "🔔 Phát hiện Tycoon!", Content = "Server này có " .. tycoonListStr .. "! Đã gửi thông báo.", Duration = 5})
        else
            Rayfield:Notify({Title = "ℹ️ Kiểm tra Tycoon", Content = "Server không có Tycoon 5 hoặc Tycoon 10.", Duration = 4})
        end
    end)
end

CheckAndNotifyTycoon()

-- ============================
-- HÀM GỬI WEBHOOK PHẢN HỒI
-- ============================
local WEBHOOK_URL = "https://discord.com/api/webhooks/1545333668187344957/jWX4F4hfLlZJ6-7uslrSamudPk_FsOQQf6QHcxJGFSbZxlsFZcSFgM5EVdJgSxI8niwy"

local function SendWebhook(messageText)
    if not requestFunc then
        Rayfield:Notify({Title = "⚠️ Thất bại", Content = "Executor không hỗ trợ HTTP Request!", Duration = 3})
        return false
    end

    local payload = {
        ["username"] = "Feedback Bot",
        ["embeds"] = {{
            ["title"] = "📩 Phản hồi từ người dùng",
            ["color"] = 3447003,
            ["fields"] = {
                { ["name"] = "👤 Người gửi", ["value"] = Player.Name .. " (@" .. Player.DisplayName .. ")", ["inline"] = true },
                { ["name"] = "🆔 User ID", ["value"] = tostring(Player.UserId), ["inline"] = true },
                { ["name"] = "📝 Nội dung", ["value"] = messageText, ["inline"] = false }
            },
            ["footer"] = { ["text"] = "Gửi lúc: " .. os.date("%H:%M:%S - %d/%m/%Y") }
        }}
    }

    local success, response = pcall(function()
        return requestFunc({
            Url = WEBHOOK_URL,
            Method = "POST",
            Headers = { ["Content-Type"] = "application/json" },
            Body = HttpService:JSONEncode(payload)
        })
    end)

    if success and response and (response.StatusCode == 200 or response.StatusCode == 204) then
        return true
    else
        return false
    end
end

-- ============================
-- HÀM KIỂM TRA & TELEPORT THEO BẢNG TỌA ĐỘ TYCOON
-- ============================
local function TeleportByTycoonMap(coordMap)
    local myTycoon = getMyTycoon()
    if myTycoon then
        local tycoonName = myTycoon.Name
        local targetVector = coordMap[tycoonName]
        
        if targetVector then
            teleportWithNoclip(CFrame.new(targetVector))
            Rayfield:Notify({Title = "🚀 Thành công", Content = "Đã dịch chuyển (" .. tycoonName .. ")!", Duration = 2})
        else
            Rayfield:Notify({Title = "⚠️ Thông báo", Content = "Tycoon bạn chưa được thêm!", Duration = 3})
        end
    else
        Rayfield:Notify({Title = "❌ Lỗi", Content = "Không tìm thấy Tycoon của bạn!", Duration = 3})
    end
end

-- ============================
-- HÀM TỰ ĐỘNG MUA POWER LEVEL
-- ============================
local function UpgradePower(powerType, amount)
    amount = amount or 1
    local myTycoon = getMyTycoon() or Workspace:FindFirstChild("Tycoon7") or Workspace:FindFirstChild("Tycoon3")
    if myTycoon then
        local remotes = myTycoon:FindFirstChild("Remotes")
        if remotes then
            local event = remotes:FindFirstChild("UpgradePowerLevel")
            if event then
                local success = pcall(function()
                    if event:IsA("RemoteFunction") then
                        event:InvokeServer(powerType, amount)
                    elseif event:IsA("RemoteEvent") then
                        event:FireServer(powerType, amount)
                    end
                end)
                return success
            end
        end
    end
    
    local success = pcall(function()
        local Event = Workspace.Tycoon7.Remotes.UpgradePowerLevel
        if Event:IsA("RemoteFunction") then
            Event:InvokeServer(powerType, amount)
        else
            Event:FireServer(powerType, amount)
        end
    end)
    return success
end

-- ============================
-- HÀM DỊCH CHUYỂN BẰNG CFRAME
-- ============================
local function teleportCFrame(cframe)
    if not RootPart then return end
    RootPart.CFrame = cframe
end

-- ============================
-- HÀM MUA NÔNG TRẠI (UNLOCK ORCHARD)
-- ============================
local function BuyOrchard()
    pcall(function()
        local myTycoon = getMyTycoon() or Workspace:FindFirstChild("Tycoon7")
        if myTycoon then
            local remotes = myTycoon:FindFirstChild("Remotes")
            if remotes then
                local unlockOrchard = remotes:FindFirstChild("UnlockOrchard")
                if unlockOrchard and unlockOrchard:IsA("RemoteFunction") then
                    unlockOrchard:InvokeServer()
                    Rayfield:Notify({Title = "🌳", Content = "Đã gửi lệnh Mua nông trại!", Duration = 3})
                    return
                end
            end
        end
        Workspace:WaitForChild("Tycoon7"):WaitForChild("Remotes"):WaitForChild("UnlockOrchard"):InvokeServer()
        Rayfield:Notify({Title = "🌳", Content = "Đã gửi lệnh Mua nông trại (Tycoon7)!", Duration = 3})
    end)
end

-- ============================
-- HÀM MUA CHỖ TRỒNG CÂY (PLOT 1 -> 100)
-- ============================
local function DoUnlockPlot()
    local myTycoon = getMyTycoon() or Workspace:FindFirstChild("Tycoon7")
    if not myTycoon then return end

    local remotes = myTycoon:FindFirstChild("Remotes")
    if not remotes then return end

    local unlockPlotRemote = remotes:FindFirstChild("UnlockPlot")
    if unlockPlotRemote and unlockPlotRemote:IsA("RemoteFunction") then
        for i = 1, 100 do
            if not _G_AutoUnlockPlot then break end
            pcall(function()
                unlockPlotRemote:InvokeServer(i)
            end)
            task.wait(0.02)
        end
    end
end

-- ============================
-- HÀM THỰC HIỆN NÂNG CẤP
-- ============================
local function DoUpgrade(amount)
    if not _G_AutoUpgrade then return end
    local tycoon = getMyTycoon() or Workspace:FindFirstChild("Tycoon7")
    if not tycoon then return end

    pcall(function()
        local purchases = tycoon:FindFirstChild("Purchases")
        if purchases then
            local lr1 = purchases:FindFirstChild("Lemon Republic")
            if lr1 then
                local lr2 = lr1:FindFirstChild("Lemon Republic")
                if lr2 then
                    local lr3 = lr2:FindFirstChild("Lemon Republic")
                    if lr3 then
                        local upgradeRemote = lr3:FindFirstChild("Upgrade")
                        if upgradeRemote and upgradeRemote:IsA("RemoteFunction") then
                            task.spawn(function()
                                for i = 1, amount do
                                    if not _G_AutoUpgrade then break end
                                    pcall(function() upgradeRemote:InvokeServer(1) end)
                                end
                            end)
                        end
                    end
                end
            end

            local lx1 = purchases:FindFirstChild("LemonX")
            if lx1 then
                local lx2 = lx1:FindFirstChild("LemonX")
                if lx2 then
                    local lx3 = lx2:FindFirstChild("LemonX")
                    if lx3 then
                        local upgradeRemoteX = lx3:FindFirstChild("Upgrade")
                        if upgradeRemoteX and upgradeRemoteX:IsA("RemoteFunction") then
                            task.spawn(function()
                                for i = 1, amount do
                                    if not _G_AutoUpgrade then break end
                                    pcall(function() upgradeRemoteX:InvokeServer(1) end)
                                end
                            end)
                        end
                    end
                end
            end
        end
    end)

    local purchases = tycoon:FindFirstChild("Purchases")
    if not purchases then return end

    for _, item in pairs(purchases:GetDescendants()) do
        if not _G_AutoUpgrade then break end

        if item:IsA("RemoteFunction") and item.Name == "Upgrade" then
            task.spawn(function()
                for i = 1, amount do
                    if not _G_AutoUpgrade then break end
                    pcall(function()
                        item:InvokeServer(1)
                    end)
                end
            end)
        end
    end
end

-- ============================
-- HÀM XÂY BẰNG MÁY MUA TỰ ĐỘNG TỪ XA
-- ============================
local function DoRemoteBuild()
    local myTycoon = getMyTycoon() or Workspace:FindFirstChild("Tycoon7")
    if not myTycoon then 
        return false, "Không tìm thấy Tycoon!"
    end

    local purchases = myTycoon:FindFirstChild("Purchases")
    if not purchases then 
        return false, "Không tìm thấy Purchases trong Tycoon!"
    end

    local count = 0
    for _, item in pairs(purchases:GetDescendants()) do
        if item.Name == "Purchase" then
            if item:IsA("RemoteFunction") then
                task.spawn(function()
                    pcall(function() item:InvokeServer(true, false) end)
                end)
                count = count + 1
            elseif item:IsA("RemoteEvent") then
                task.spawn(function()
                    pcall(function() item:FireServer(true, false) end)
                end)
                count = count + 1
            end
        end
    end
    return true, "Đã gửi " .. count .. " lệnh mua!"
end

-- ============================
-- HÀM THỰC HIỆN TÁI SINH
-- ============================
local function DoRebirth()
    pcall(function()
        local myTycoon = getMyTycoon()
        local rebirthRemote = nil
        
        if myTycoon and myTycoon:FindFirstChild("Remotes") and myTycoon.Remotes:FindFirstChild("Rebirth") then
            rebirthRemote = myTycoon.Remotes.Rebirth
        else
            rebirthRemote = Workspace:FindFirstChild("Rebirth", true) or ReplicatedStorage:FindFirstChild("Rebirth", true)
        end

        if rebirthRemote then
            if rebirthRemote:IsA("RemoteFunction") then
                rebirthRemote:InvokeServer(nil)
            elseif rebirthRemote:IsA("RemoteEvent") then
                rebirthRemote:FireServer(nil)
            end
        end
    end)
end

-- ============================
-- HÀM THỰC HIỆN TÁI SINH TRÁI (EVOLVE)
-- ============================
local function DoEvolve()
    pcall(function()
        local myTycoon = getMyTycoon()
        local evolveRemote = nil

        if myTycoon and myTycoon:FindFirstChild("Remotes") and myTycoon.Remotes:FindFirstChild("Evolve") then
            evolveRemote = myTycoon.Remotes.Evolve
        elseif Workspace:FindFirstChild("Tycoon7") and Workspace.Tycoon7:FindFirstChild("Remotes") and Workspace.Tycoon7.Remotes:FindFirstChild("Evolve") then
            evolveRemote = Workspace.Tycoon7.Remotes.Evolve
        else
            evolveRemote = Workspace:FindFirstChild("Evolve", true)
        end

        if evolveRemote then
            if evolveRemote:IsA("RemoteFunction") then
                evolveRemote:InvokeServer(nil)
            elseif evolveRemote:IsA("RemoteEvent") then
                evolveRemote:FireServer(nil)
            end
        end
    end)
end

-- ============================
-- HÀM LẤY PET SLIME
-- ============================
local function ClaimSlimePet()
    pcall(function()
        local myTycoon = getMyTycoon()
        local claimRemote = nil

        if myTycoon and myTycoon:FindFirstChild("Remotes") and myTycoon.Remotes:FindFirstChild("ClaimCompanion") then
            claimRemote = myTycoon.Remotes.ClaimCompanion
        elseif Workspace:FindFirstChild("Tycoon7") and Workspace.Tycoon7:FindFirstChild("Remotes") and Workspace.Tycoon7.Remotes:FindFirstChild("ClaimCompanion") then
            claimRemote = Workspace.Tycoon7.Remotes.ClaimCompanion
        else
            claimRemote = Workspace:FindFirstChild("ClaimCompanion", true)
        end

        if claimRemote then
            if claimRemote:IsA("RemoteFunction") then
                claimRemote:InvokeServer(2)
            elseif claimRemote:IsA("RemoteEvent") then
                claimRemote:FireServer(2)
            end
            Rayfield:Notify({Title = "🧪", Content = "Đã gửi lệnh nhận Pet Slime!", Duration = 3})
        else
            Rayfield:Notify({Title = "⚠️ Lỗi", Content = "Không tìm thấy Remote nhận Pet!", Duration = 3})
        end
    end)
end

-- ============================
-- HÀM XỬ LÝ HỢP ĐỒNG (OFFER)
-- ============================
local function SendOfferAction(actionType)
    pcall(function()
        local myTycoon = getMyTycoon()
        local offerRemote = nil
        
        if myTycoon and myTycoon:FindFirstChild("Remotes") and myTycoon.Remotes:FindFirstChild("PhoneOffer") then
            offerRemote = myTycoon.Remotes.PhoneOffer
        elseif Workspace:FindFirstChild("Tycoon7") and Workspace.Tycoon7:FindFirstChild("Remotes") and Workspace.Tycoon7.Remotes:FindFirstChild("PhoneOffer") then
            offerRemote = Workspace.Tycoon7.Remotes.PhoneOffer
        else
            offerRemote = Workspace:FindFirstChild("PhoneOffer", true)
        end

        if offerRemote then
            offerRemote:FireServer(actionType)
        end
    end)
end

local function AcceptContract() SendOfferAction("Accept") end
local function RaiseContract() SendOfferAction("Raise") end
local function RejectContract() SendOfferAction("Reject") end

-- ============================
-- HÀM TÌM QUẢ "Fruit" TRONG LemonTree
-- ============================
local function FindFruitsInLemonTrees()
    local fruits = {}
    for _, v in pairs(Workspace:GetDescendants()) do
        if v:IsA("BasePart") and v.Name == "Fruit" and v.Parent then
            local parentModel = v:FindFirstAncestor("LemonTree")
            if parentModel and parentModel:IsA("Model") and parentModel.Name == "LemonTree" then
                table.insert(fruits, v)
            end
        end
    end
    return fruits
end

local function FindClickDetector(fruit)
    local clickPart = fruit:FindFirstChild("ClickFruitPart")
    if clickPart then
        local clickDetector = clickPart:FindFirstChildWhichIsA("ClickDetector")
        if clickDetector then return clickDetector end
    end
    return fruit:FindFirstChildWhichIsA("ClickDetector")
end

local function ClickFruit(fruit)
    local clickDetector = FindClickDetector(fruit)
    if not clickDetector then return false end

    if fireclickdetector then
        pcall(function() fireclickdetector(clickDetector) end)
        return true
    end

    if firesignal and clickDetector.MouseClick then
        pcall(function() firesignal(clickDetector.MouseClick) end)
        return true
    end

    return false
end

local function HarvestOnce()
    local fruits = FindFruitsInLemonTrees()
    if #fruits == 0 then return false end

    for _, fruit in ipairs(fruits) do
        if not _G_AutoHarvest then break end
        if fruit and fruit.Parent then
            teleportCFrame(CFrame.new(fruit.Position + Vector3.new(0, 2, 0)))
            task.wait(0.02)
            ClickFruit(fruit)
            task.wait(0.02)
        end
    end
    return true
end

-- ============================
-- HÀM NHẶT BAO TIỀN
-- ============================
local function CollectMoneyOnce()
    pcall(function()
        local core = ReplicatedStorage:FindFirstChild("Core")
        if core then
            local remoteReq = core:FindFirstChild("RemoteRequest")
            if remoteReq then
                local redeemRemote = remoteReq:FindFirstChild("DropService.Redeem")
                if redeemRemote then
                    if redeemRemote:IsA("RemoteFunction") then
                        redeemRemote:InvokeServer()
                    elseif redeemRemote:IsA("RemoteEvent") then
                        redeemRemote:FireServer()
                    end
                end
            end
        end

        local dropsFolder = Workspace:FindFirstChild("Drops") or Workspace:FindFirstChild("DropsFolder") or Workspace
        for _, drop in ipairs(dropsFolder:GetChildren()) do
            if drop.Name:lower():find("money") or drop.Name:lower():find("cash") or drop.Name:lower():find("drop") or drop.Name:lower():find("bag") then
                if drop:IsA("BasePart") and RootPart and firetouchinterest then
                    firetouchinterest(RootPart, drop, 0)
                    task.wait()
                    firetouchinterest(RootPart, drop, 1)
                elseif drop:IsA("Model") and drop.PrimaryPart and RootPart and firetouchinterest then
                    firetouchinterest(RootPart, drop.PrimaryPart, 0)
                    task.wait()
                    firetouchinterest(RootPart, drop.PrimaryPart, 1)
                end
            end
        end
    end)
end

local function ClickIncomeStream(itemName)
    local myTycoon = getMyTycoon() or Workspace:FindFirstChild("Tycoon7")
    if myTycoon and myTycoon:FindFirstChild("Remotes") and myTycoon.Remotes:FindFirstChild("WakeIncomeStream") then
        pcall(function()
            myTycoon.Remotes.WakeIncomeStream:InvokeServer(itemName)
        end)
    else
        for _, v in pairs(Workspace:GetDescendants()) do
            if (v:IsA("RemoteFunction") or v:IsA("RemoteEvent")) and v.Name == "WakeIncomeStream" then
                pcall(function()
                    if v:IsA("RemoteFunction") then
                        v:InvokeServer(itemName)
                    else
                        v:FireServer(itemName)
                    end
                end)
            end
        end
    end
end

-- ============================
-- TAB DỊCH CHUYỂN
-- ============================
local TeleportTab = Window:CreateTab("Dịch chuyển", 4483362458)

TeleportTab:CreateParagraph({
    Title = "📍 Dịch chuyển theo Tycoon",
    Content = "Hiện tại hỗ trợ: Tycoon 2, Tycoon 3, Tycoon 4, Tycoon 6, Tycoon 7, Tycoon 8, Tycoon 9."
})

TeleportTab:CreateButton({
    Name = "Dịch chuyển lại giá đỡ chanh",
    Callback = function()
        TeleportByTycoonMap({
            ["Tycoon2"] = Vector3.new(39.09, 4.00, -179.43),
            ["Tycoon3"] = Vector3.new(38.79, 4.00, 1.10),
            ["Tycoon4"] = Vector3.new(38.13, 4.00, 179.34),
            ["Tycoon6"] = Vector3.new(-39.50, 4.00, 360.49),
            ["Tycoon7"] = Vector3.new(-40.77, 4.00, 176.38),
            ["Tycoon8"] = Vector3.new(-39.87, 4.00, -0.70),
            ["Tycoon9"] = Vector3.new(-39.58, 4.00, -181.42)
        })
    end,
})

TeleportTab:CreateButton({
    Name = "Giao hàng chanh",
    Callback = function()
        TeleportByTycoonMap({
            ["Tycoon2"] = Vector3.new(112.68, 4.07, -224.19),
            ["Tycoon3"] = Vector3.new(116.84, 4.07, -42.25),
            ["Tycoon4"] = Vector3.new(112.05, 4.07, 141.31),
            ["Tycoon6"] = Vector3.new(-115.07, 4.07, 401.55),
            ["Tycoon7"] = Vector3.new(-115.51, 4.07, 223.06),
            ["Tycoon8"] = Vector3.new(-115.66, 4.07, 41.22),
            ["Tycoon9"] = Vector3.new(-112.29, 4.07, -137.21)
        })
    end,
})

TeleportTab:CreateButton({
    Name = "Kho hàng chanh",
    Callback = function()
        TeleportByTycoonMap({
            ["Tycoon2"] = Vector3.new(190.13, 4.07, -175.21),
            ["Tycoon3"] = Vector3.new(194.22, 4.07, 9.15),
            ["Tycoon4"] = Vector3.new(192.63, 4.07, 183.88),
            ["Tycoon6"] = Vector3.new(-192.13, 4.07, 350.98),
            ["Tycoon7"] = Vector3.new(-194.31, 4.07, 177.32),
            ["Tycoon8"] = Vector3.new(-203.16, 4.07, -8.77),
            ["Tycoon9"] = Vector3.new(-193.07, 4.07, -183.40)
        })
    end,
})

TeleportTab:CreateButton({
    Name = "Công ty chanh",
    Callback = function()
        TeleportByTycoonMap({
            ["Tycoon2"] = Vector3.new(400.53, 28.30, -221.45),
            ["Tycoon3"] = Vector3.new(395.88, 28.30, -43.22),
            ["Tycoon4"] = Vector3.new(399.40, 28.30, 135.95),
            ["Tycoon6"] = Vector3.new(-403.66, 28.30, 402.23),
            ["Tycoon7"] = Vector3.new(-398.45, 28.30, 223.69),
            ["Tycoon8"] = Vector3.new(-400.83, 28.30, 40.38),
            ["Tycoon9"] = Vector3.new(-398.83, 28.30, -136.05)
        })
    end,
})

TeleportTab:CreateButton({
    Name = "Công ty chanh tầng 2",
    Callback = function()
        TeleportByTycoonMap({
            ["Tycoon2"] = Vector3.new(411.45, 58.53, -220.91),
            ["Tycoon3"] = Vector3.new(408.00, 58.53, -41.48),
            ["Tycoon4"] = Vector3.new(412.92, 58.53, 139.70),
            ["Tycoon6"] = Vector3.new(-410.89, 58.53, 397.99),
            ["Tycoon7"] = Vector3.new(-409.21, 58.53, 216.80),
            ["Tycoon8"] = Vector3.new(-409.28, 58.53, 41.76),
            ["Tycoon9"] = Vector3.new(-410.54, 58.53, -136.00)
        })
    end,
})

TeleportTab:CreateButton({
    Name = "Công ty chanh tầng 3",
    Callback = function()
        TeleportByTycoonMap({
            ["Tycoon2"] = Vector3.new(411.10, 88.03, -212.89),
            ["Tycoon3"] = Vector3.new(412.26, 88.03, -40.90),
            ["Tycoon4"] = Vector3.new(409.72, 88.03, 144.61),
            ["Tycoon6"] = Vector3.new(-413.02, 88.01, 402.40),
            ["Tycoon7"] = Vector3.new(-407.30, 88.03, 223.44),
            ["Tycoon8"] = Vector3.new(-410.00, 88.03, 41.13),
            ["Tycoon9"] = Vector3.new(-412.64, 88.03, -135.43)
        })
    end,
})

TeleportTab:CreateButton({
    Name = "Thí nghiệm chanh",
    Callback = function()
        TeleportByTycoonMap({
            ["Tycoon2"] = Vector3.new(430.64, 53.07, -144.40),
            ["Tycoon3"] = Vector3.new(425.36, 53.10, 42.22),
            ["Tycoon4"] = Vector3.new(422.24, 53.09, 219.04),
            ["Tycoon6"] = Vector3.new(-428.99, 53.07, 321.90),
            ["Tycoon7"] = Vector3.new(-428.56, 53.07, 137.11),
            ["Tycoon8"] = Vector3.new(-425.53, 53.12, -36.26),
            ["Tycoon9"] = Vector3.new(-426.19, 53.07, -215.67)
        })
    end,
})

TeleportTab:CreateButton({
    Name = "Thí nghiệm chanh tầng 2",
    Callback = function()
        TeleportByTycoonMap({
            ["Tycoon2"] = Vector3.new(429.94, 91.50, -131.60),
            ["Tycoon3"] = Vector3.new(432.70, 91.50, 48.15),
            ["Tycoon4"] = Vector3.new(430.72, 91.50, 228.39),
            ["Tycoon6"] = Vector3.new(-424.70, 91.50, 313.89),
            ["Tycoon7"] = Vector3.new(-431.80, 91.50, 128.94),
            ["Tycoon8"] = Vector3.new(-436.43, 91.50, -47.86),
            ["Tycoon9"] = Vector3.new(-438.46, 91.50, -229.90)
        })
    end,
})

TeleportTab:CreateSection("🛠️ Công cụ Lấy Tọa Độ")

TeleportTab:CreateButton({
    Name = "📋 Copy tọa độ hiện tại (CFrame)",
    Callback = function()
        if RootPart then
            local pos = RootPart.CFrame
            local cframeStr = string.format("Vector3.new(%.2f, %.2f, %.2f)", pos.X, pos.Y, pos.Z)
            
            if setclipboard then
                setclipboard(cframeStr)
                Rayfield:Notify({Title = "✅ Đã copy!", Content = cframeStr, Duration = 3})
            else
                print("Tọa độ của bạn: " .. cframeStr)
                Rayfield:Notify({Title = "📋 Tọa độ (Xem Console F12)", Content = cframeStr, Duration = 4})
            end
        end
    end,
})

-- ============================
-- TAB SHOP (MUA ĐỒ)
-- ============================
local ShopTab = Window:CreateTab("Mua đồ", 4483362458)

ShopTab:CreateParagraph({
    Title = "🛒 Cửa hàng Tycoon",
    Content = "Mua đồ thủ công hoặc bật tự động mua liên tục."
})

ShopTab:CreateButton({
    Name = "mua đồ ăn trái cây",
    Callback = function()
        local success = UpgradePower("AutoFruit", 1)
        if success then
            Rayfield:Notify({Title = "🍎", Content = "Đã mua đồ ăn trái cây thành công!", Duration = 2})
        else
            Rayfield:Notify({Title = "⚠️ Lỗi", Content = "Mua đồ ăn trái cây thất bại!", Duration = 2})
        end
    end,
})

ShopTab:CreateToggle({
    Name = "Tự động mua đồ ăn trái cây",
    CurrentValue = false,
    Flag = "ToggleAutoBuyFruit",
    Callback = function(Value)
        _G_AutoBuyFruit = Value
        if Threads.AutoBuyFruit then
            task.cancel(Threads.AutoBuyFruit)
            Threads.AutoBuyFruit = nil
        end

        if _G_AutoBuyFruit then
            Rayfield:Notify({Title = "🍎", Content = "Đã BẬT tự động mua đồ ăn trái cây!", Duration = 2})
            Threads.AutoBuyFruit = task.spawn(function()
                while _G_AutoBuyFruit do
                    UpgradePower("AutoFruit", 1)
                    task.wait(0.2)
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT tự động mua đồ ăn trái cây!", Duration = 2})
        end
    end
})

ShopTab:CreateSection("Máy & Quản lý")

ShopTab:CreateButton({
    Name = "mua máy nâng cấp từ xa",
    Callback = function()
        local success = UpgradePower("BuyNext", 1)
        if success then
            Rayfield:Notify({Title = "🛒", Content = "Đã mua máy nâng cấp từ xa!", Duration = 2})
        else
            Rayfield:Notify({Title = "⚠️ Lỗi", Content = "Mua máy nâng cấp từ xa thất bại!", Duration = 2})
        end
    end,
})

ShopTab:CreateToggle({
    Name = "Tự động mua máy nâng cấp từ xa",
    CurrentValue = false,
    Flag = "ToggleAutoBuyNext",
    Callback = function(Value)
        _G_AutoBuyNext = Value
        if Threads.AutoBuyNext then
            task.cancel(Threads.AutoBuyNext)
            Threads.AutoBuyNext = nil
        end

        if _G_AutoBuyNext then
            Threads.AutoBuyNext = task.spawn(function()
                while _G_AutoBuyNext do
                    UpgradePower("BuyNext", 1)
                    task.wait(0.2)
                end
            end)
        end
    end
})

ShopTab:CreateButton({
    Name = "mua quản lí",
    Callback = function()
        UpgradePower("Manage", 1)
    end,
})

ShopTab:CreateToggle({
    Name = "Tự động mua quản lí",
    CurrentValue = false,
    Flag = "ToggleAutoBuyManage",
    Callback = function(Value)
        _G_AutoBuyManage = Value
        if Threads.AutoBuyManage then
            task.cancel(Threads.AutoBuyManage)
            Threads.AutoBuyManage = nil
        end

        if _G_AutoBuyManage then
            Threads.AutoBuyManage = task.spawn(function()
                while _G_AutoBuyManage do
                    UpgradePower("Manage", 1)
                    task.wait(0.2)
                end
            end)
        end
    end
})

ShopTab:CreateButton({
    Name = "mua thêm speed",
    Callback = function()
        UpgradePower("WalkSpeed", 1)
    end,
})

ShopTab:CreateToggle({
    Name = "Tự động mua thêm speed",
    CurrentValue = false,
    Flag = "ToggleAutoBuyWalkSpeed",
    Callback = function(Value)
        _G_AutoBuyWalkSpeed = Value
        if Threads.AutoBuyWalkSpeed then
            task.cancel(Threads.AutoBuyWalkSpeed)
            Threads.AutoBuyWalkSpeed = nil
        end

        if _G_AutoBuyWalkSpeed then
            Threads.AutoBuyWalkSpeed = task.spawn(function()
                while _G_AutoBuyWalkSpeed do
                    UpgradePower("WalkSpeed", 1)
                    task.wait(0.2)
                end
            end)
        end
    end
})

ShopTab:CreateButton({
    Name = "mua nâng cấp nhiều hơn",
    Callback = function()
        UpgradePower("UpgradeStack", 1)
    end,
})

ShopTab:CreateToggle({
    Name = "Tự động mua nâng cấp nhiều hơn",
    CurrentValue = false,
    Flag = "ToggleAutoBuyUpgradeStack",
    Callback = function(Value)
        _G_AutoBuyUpgradeStack = Value
        if Threads.AutoBuyUpgradeStack then
            task.cancel(Threads.AutoBuyUpgradeStack)
            Threads.AutoBuyUpgradeStack = nil
        end

        if _G_AutoBuyUpgradeStack then
            Threads.AutoBuyUpgradeStack = task.spawn(function()
                while _G_AutoBuyUpgradeStack do
                    UpgradePower("UpgradeStack", 1)
                    task.wait(0.2)
                end
            end)
        end
    end
})

ShopTab:CreateButton({
    Name = "lụm trái thêm tiền",
    Callback = function()
        UpgradePower("ClickFruitValue", 1)
    end,
})

ShopTab:CreateToggle({
    Name = "Tự động lụm trái thêm tiền",
    CurrentValue = false,
    Flag = "ToggleAutoBuyClickFruitValue",
    Callback = function(Value)
        _G_AutoBuyClickFruitValue = Value
        if Threads.AutoBuyClickFruitValue then
            task.cancel(Threads.AutoBuyClickFruitValue)
            Threads.AutoBuyClickFruitValue = nil
        end

        if _G_AutoBuyClickFruitValue then
            Threads.AutoBuyClickFruitValue = task.spawn(function()
                while _G_AutoBuyClickFruitValue do
                    UpgradePower("ClickFruitValue", 1)
                    task.wait(0.2)
                end
            end)
        end
    end
})

-- ============================
-- TAB FARM
-- ============================
local FarmTab = Window:CreateTab("Farm", 4483362458)

FarmTab:CreateParagraph({
    Title = "⚠️ LƯU Ý QUAN TRỌNG",
    Content = "Khuyến cáo: KHÔNG ĐƯỢC BẬT 2 TÍNH NĂNG CÙNG 1 LÚC TRONG TAB FARM! Hãy tắt tính năng đang chạy trước khi bật tính năng mới."
})

FarmTab:CreateButton({
    Name = "Mua nông trại",
    Callback = function()
        BuyOrchard()
    end,
})

FarmTab:CreateToggle({
    Name = "mua chỗ trồng cây",
    CurrentValue = false,
    Flag = "ToggleUnlockPlot",
    Callback = function(Value)
        _G_AutoUnlockPlot = Value
        if Threads.UnlockPlot then
            task.cancel(Threads.UnlockPlot)
            Threads.UnlockPlot = nil
        end

        if _G_AutoUnlockPlot then
            Rayfield:Notify({Title = "🌱", Content = "Đã BẬT tự động mua chỗ trồng cây (1 -> 100)!", Duration = 3})
            Threads.UnlockPlot = task.spawn(function()
                while _G_AutoUnlockPlot do
                    DoUnlockPlot()
                    task.wait(1)
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT mua chỗ trồng cây!", Duration = 2})
        end
    end
})

FarmTab:CreateParagraph({
    Title = "⚡ Nâng cấp Cực Nhanh",
    Content = "Tự động gửi gói tin nâng cấp liên tục không bị gián đoạn."
})

FarmTab:CreateToggle({
    Name = "Nâng cấp (Siêu Nhanh)",
    CurrentValue = false,
    Flag = "ToggleUpgrade",
    Callback = function(Value)
        _G_AutoUpgrade = Value
        if Threads.Upgrade then
            task.cancel(Threads.Upgrade)
            Threads.Upgrade = nil
        end

        if _G_AutoUpgrade then
            Rayfield:Notify({Title = "⚡", Content = "Đã bật tự động nâng cấp Siêu Nhanh!", Duration = 2})
            Threads.Upgrade = task.spawn(function()
                while _G_AutoUpgrade do
                    DoUpgrade(UpgradeAmount)
                    task.wait(0.1)
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT nâng cấp!", Duration = 2})
        end
    end
})

FarmTab:CreateSlider({
    Name = "Số lần gửi lệnh / 1 nhịp",
    Range = {1, 100},
    Increment = 1,
    Suffix = "lần",
    CurrentValue = 10,
    Flag = "SliderUpgradeAmount",
    Callback = function(Value)
        UpgradeAmount = Value
    end,
})

FarmTab:CreateSection("🏗️ Xây Dựng Từ Xa")

FarmTab:CreateButton({
    Name = "xây dựng nhà 1 lần",
    Callback = function()
        Rayfield:Notify({Title = "🏗️", Content = "Đang thực hiện xây dựng nhà 1 lần...", Duration = 2})
        local ok, msg = DoRemoteBuild()
        if ok then
            Rayfield:Notify({Title = "✅ Thành công", Content = "Xây dựng 1 lần hoàn tất! (" .. msg .. ")", Duration = 3})
        else
            Rayfield:Notify({Title = "❌ Lỗi", Content = "Lỗi: " .. msg, Duration = 3})
        end
    end,
})

FarmTab:CreateToggle({
    Name = "xây bằng máy mua tự động từ xa (Liên tục)",
    CurrentValue = false,
    Flag = "ToggleAutoRemoteBuild",
    Callback = function(Value)
        _G_AutoRemoteBuild = Value
        if Threads.RemoteBuild then
            task.cancel(Threads.RemoteBuild)
            Threads.RemoteBuild = nil
        end

        if _G_AutoRemoteBuild then
            Rayfield:Notify({Title = "🏗️", Content = "Đã BẬT xây bằng máy mua tự động từ xa!", Duration = 2})
            Threads.RemoteBuild = task.spawn(function()
                while _G_AutoRemoteBuild do
                    local ok, err = DoRemoteBuild()
                    if not ok then
                        Rayfield:Notify({Title = "⚠️ Lỗi Tự Động Xây", Content = err, Duration = 3})
                    end
                    task.wait(0.2)
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT xây bằng máy từ xa!", Duration = 2})
        end
    end
})

FarmTab:CreateButton({
    Name = "Kiểm tra Tycoon hiện tại",
    Callback = function()
        local myTycoon = getMyTycoon()
        if myTycoon then
            Rayfield:Notify({Title = "🏠 Tycoon", Content = "Đã xác nhận: " .. myTycoon.Name, Duration = 3})
        else
            Rayfield:Notify({Title = "⚠️ Lỗi", Content = "Không tìm thấy Tycoon nào!", Duration = 3})
        end
    end,
})

FarmTab:CreateToggle({
    Name = "Tự động xây dựng nhà (Bản Cũ)",
    CurrentValue = false,
    Flag = "ToggleBuildHouse",
    Callback = function(Value)
        _G_AutoBuild = Value
        if Threads.Build then
            task.cancel(Threads.Build)
            Threads.Build = nil
        end

        if _G_AutoBuild then
            Rayfield:Notify({Title = "✅", Content = "Đã bật tự động xây dựng!", Duration = 2})
            Threads.Build = task.spawn(function()
                while _G_AutoBuild do
                    local myTycoon = getMyTycoon()
                    if myTycoon then
                        for _, obj in pairs(myTycoon:GetDescendants()) do
                            if not _G_AutoBuild then break end

                            if obj:IsA("RemoteFunction") and (obj.Name == "Purchase" or obj.Name == "PurchaseBuyEffect") then
                                task.spawn(function()
                                    pcall(function() obj:InvokeServer(false, false) end)
                                end)
                            elseif obj:IsA("RemoteEvent") and (obj.Name == "Purchase" or obj.Name == "PurchaseBuyEffect") then
                                task.spawn(function()
                                    pcall(function() obj:FireServer(false, false) end)
                                end)
                            end
                        end
                    else
                        Rayfield:Notify({Title = "⚠️ Lỗi", Content = "Không tìm thấy Tycoon để xây dựng!", Duration = 2})
                    end
                    task.wait(0.1)
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT tự động xây nhà!", Duration = 2})
        end
    end
})

FarmTab:CreateSection("🔑 Khóa Cửa Cây")

FarmTab:CreateButton({
    Name = "Lấy key mở cửa cây",
    Callback = function()
        teleportWithNoclip(CFrame.new(-165.87, -45.10, -106.19))
        Rayfield:Notify({Title = "✅ Thành công", Content = "Đã bay đến vị trí lấy key!", Duration = 3})
    end,
})

FarmTab:CreateButton({
    Name = "Mở khóa cửa cây",
    Callback = function()
        teleportWithNoclip(CFrame.new(29.02, -45.10, -79.67))
        Rayfield:Notify({Title = "🚀 Thành công", Content = "Đã bay đến cửa cây!", Duration = 3})
    end,
})

FarmTab:CreateButton({
    Name = "Lấy key UFO",
    Callback = function()
        teleportWithNoclip(CFrame.new(203.999939, -42.0280724, 285))
        Rayfield:Notify({Title = "🛸 Thành công", Content = "Đã bay đến vị trí lấy key UFO!", Duration = 3})
    end,
})

FarmTab:CreateButton({
    Name = "bay đến người ngoài hành tinh",
    Callback = function()
        teleportWithNoclip(CFrame.new(-39.51, -42.13, 179.55))
        Rayfield:Notify({Title = "👽 Thành công", Content = "Đã bay đến vị trí người ngoài hành tinh!", Duration = 3})
    end,
})

-- ============================
-- TAB HỢP ĐỒNG
-- ============================
local ContractTab = Window:CreateTab("Hợp Đồng", 4483362458)

ContractTab:CreateButton({
    Name = "Đồng ý hợp đồng",
    Callback = function()
        AcceptContract()
        Rayfield:Notify({Title = "📜", Content = "Đã đồng ý hợp đồng!", Duration = 2})
    end,
})

ContractTab:CreateToggle({
    Name = "Tự động đồng ý",
    CurrentValue = false,
    Flag = "ToggleAutoOffer",
    Callback = function(Value)
        _G_AutoOffer = Value
        if Threads.Offer then
            task.cancel(Threads.Offer)
            Threads.Offer = nil
        end

        if _G_AutoOffer then
            Rayfield:Notify({Title = "📜", Content = "Đã BẬT tự động đồng ý hợp đồng!", Duration = 2})
            Threads.Offer = task.spawn(function()
                while _G_AutoOffer do
                    AcceptContract()
                    task.wait(5)
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT tự động đồng ý!", Duration = 2})
        end
    end
})

ContractTab:CreateButton({
    Name = "Thêm tiền hợp đồng",
    Callback = function()
        RaiseContract()
        Rayfield:Notify({Title = "💵", Content = "Đã yêu cầu tăng tiền!", Duration = 2})
    end,
})

ContractTab:CreateToggle({
    Name = "Tự động kêu thêm tiền",
    CurrentValue = false,
    Flag = "ToggleAutoRaiseOffer",
    Callback = function(Value)
        _G_AutoRaiseOffer = Value
        if Threads.RaiseOffer then
            task.cancel(Threads.RaiseOffer)
            Threads.RaiseOffer = nil
        end

        if _G_AutoRaiseOffer then
            Rayfield:Notify({Title = "💵", Content = "Đã BẬT tự động tăng tiền!", Duration = 2})
            Threads.RaiseOffer = task.spawn(function()
                while _G_AutoRaiseOffer do
                    RaiseContract()
                    task.wait(5)
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT!", Duration = 2})
        end
    end
})

ContractTab:CreateButton({
    Name = "Từ chối hợp đồng",
    Callback = function()
        RejectContract()
        Rayfield:Notify({Title = "❌", Content = "Đã từ chối hợp đồng!", Duration = 2})
    end,
})

ContractTab:CreateToggle({
    Name = "Tự động từ chối",
    CurrentValue = false,
    Flag = "ToggleAutoRejectOffer",
    Callback = function(Value)
        _G_AutoRejectOffer = Value
        if Threads.RejectOffer then
            task.cancel(Threads.RejectOffer)
            Threads.RejectOffer = nil
        end

        if _G_AutoRejectOffer then
            Rayfield:Notify({Title = "❌", Content = "Đã BẬT tự động từ chối!", Duration = 2})
            Threads.RejectOffer = task.spawn(function()
                while _G_AutoRejectOffer do
                    RejectContract()
                    task.wait(5)
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT!", Duration = 2})
        end
    end
})

-- ============================
-- TAB TÁI SINH (REBIRTH)
-- ============================
local RebirthTab = Window:CreateTab("Tái Sinh", 4483362458)

RebirthTab:CreateButton({
    Name = "Tái sinh ngay",
    Callback = function()
        DoRebirth()
        Rayfield:Notify({Title = "🔄", Content = "Đã thực hiện tái sinh!", Duration = 2})
    end,
})

RebirthTab:CreateSlider({
    Name = "Thời gian tái sinh (Phút)",
    Range = {1, 180},
    Increment = 1,
    Suffix = "phút",
    CurrentValue = 15,
    Flag = "SliderRebirthDelay",
    Callback = function(Value)
        RebirthDelay = Value
    end,
})

RebirthTab:CreateToggle({
    Name = "Tự động tái sinh",
    CurrentValue = false,
    Flag = "ToggleAutoRebirth",
    Callback = function(Value)
        _G_AutoRebirth = Value
        if Threads.Rebirth then
            task.cancel(Threads.Rebirth)
            Threads.Rebirth = nil
        end

        if _G_AutoRebirth then
            Rayfield:Notify({Title = "🔄", Content = "Đã BẬT tự động tái sinh sau " .. RebirthDelay .. " phút!", Duration = 3})
            Threads.Rebirth = task.spawn(function()
                while _G_AutoRebirth do
                    local totalWaitSeconds = RebirthDelay * 60
                    for i = 1, totalWaitSeconds do
                        if not _G_AutoRebirth then break end
                        task.wait(1)
                    end
                    if _G_AutoRebirth then
                        DoRebirth()
                    end
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT tái sinh tự động!", Duration = 2})
        end
    end
})

RebirthTab:CreateParagraph({
    Title = "🍋 Tái sinh trái (Evolve)",
    Content = "Thực hiện tiến hóa/tái sinh trái cây trong Tycoon."
})

RebirthTab:CreateButton({
    Name = "Tái sinh trái",
    Callback = function()
        DoEvolve()
        Rayfield:Notify({Title = "🍋", Content = "Đã thực hiện Tái sinh trái!", Duration = 2})
    end,
})

RebirthTab:CreateToggle({
    Name = "tự động tái sinh trái",
    CurrentValue = false,
    Flag = "ToggleAutoEvolve",
    Callback = function(Value)
        _G_AutoEvolve = Value
        if Threads.Evolve then
            task.cancel(Threads.Evolve)
            Threads.Evolve = nil
        end

        if _G_AutoEvolve then
            Rayfield:Notify({Title = "🍋", Content = "Đã BẬT tự động tái sinh trái (Mỗi 30s)!", Duration = 3})
            Threads.Evolve = task.spawn(function()
                while _G_AutoEvolve do
                    DoEvolve()
                    for i = 1, 30 do
                        if not _G_AutoEvolve then break end
                        task.wait(1)
                    end
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT tự động tái sinh trái!", Duration = 2})
        end
    end
})

-- ============================
-- TAB AUTO HARVEST
-- ============================
local HarvestTab = Window:CreateTab("Auto Harvest", 4483362458)

HarvestTab:CreateToggle({
    Name = "Tự động hái quả",
    CurrentValue = false,
    Flag = "ToggleHarvest",
    Callback = function(Value)
        _G_AutoHarvest = Value
        if Threads.Harvest then
            task.cancel(Threads.Harvest)
            Threads.Harvest = nil
        end

        if _G_AutoHarvest then
            Rayfield:Notify({Title = "🍎", Content = "Đã BẬT tự động hái quả!", Duration = 2})
            Threads.Harvest = task.spawn(function()
                while _G_AutoHarvest do
                    HarvestOnce()
                    task.wait(0.1)
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT hái quả!", Duration = 2})
        end
    end
})

HarvestTab:CreateToggle({
    Name = "Nhặt bao tiền (Đã sửa lỗi)",
    CurrentValue = false,
    Flag = "ToggleCollectMoney",
    Callback = function(Value)
        _G_AutoRedeem = Value
        if Threads.Redeem then
            task.cancel(Threads.Redeem)
            Threads.Redeem = nil
        end

        if _G_AutoRedeem then
            Rayfield:Notify({Title = "💰", Content = "Đã BẬT tự động nhặt bao tiền!", Duration = 2})
            Threads.Redeem = task.spawn(function()
                while _G_AutoRedeem do
                    CollectMoneyOnce()
                    task.wait(0.1)
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã TẮT nhặt bao tiền!", Duration = 2})
        end
    end
})

-- ============================
-- TAB CLICK
-- ============================
local ClickTab = Window:CreateTab("Click", 4483362458)

ClickTab:CreateToggle({
    Name = "Auto Click LemonStand",
    CurrentValue = false,
    Flag = "ToggleClickLemonStand",
    Callback = function(Value)
        _G_AutoClickLemonStand = Value
        if Threads.LemonStand then
            task.cancel(Threads.LemonStand)
            Threads.LemonStand = nil
        end

        if _G_AutoClickLemonStand then
            Threads.LemonStand = task.spawn(function()
                while _G_AutoClickLemonStand do
                    ClickIncomeStream("LemonStand")
                    task.wait(0.05)
                end
            end)
        end
    end
})

ClickTab:CreateToggle({
    Name = "Auto Click LemonDash",
    CurrentValue = false,
    Flag = "ToggleClickLemonDash",
    Callback = function(Value)
        _G_AutoClickLemonDash = Value
        if Threads.LemonDash then
            task.cancel(Threads.LemonDash)
            Threads.LemonDash = nil
        end

        if _G_AutoClickLemonDash then
            Threads.LemonDash = task.spawn(function()
                while _G_AutoClickLemonDash do
                    ClickIncomeStream("LemonDash")
                    task.wait(0.05)
                end
            end)
        end
    end
})

ClickTab:CreateToggle({
    Name = "Auto Click LemonLabs",
    CurrentValue = false,
    Flag = "ToggleClickLemonLabs",
    Callback = function(Value)
        _G_AutoClickLemonLabs = Value
        if Threads.LemonLabs then
            task.cancel(Threads.LemonLabs)
            Threads.LemonLabs = nil
        end

        if _G_AutoClickLemonLabs then
            Threads.LemonLabs = task.spawn(function()
                while _G_AutoClickLemonLabs do
                    ClickIncomeStream("LemonLabs")
                    task.wait(0.05)
                end
            end)
        end
    end
})

ClickTab:CreateToggle({
    Name = "Auto Click LemonRobotics",
    CurrentValue = false,
    Flag = "ToggleClickLemonRobotics",
    Callback = function(Value)
        _G_AutoClickLemonRobotics = Value
        if Threads.LemonRobotics then
            task.cancel(Threads.LemonRobotics)
            Threads.LemonRobotics = nil
        end

        if _G_AutoClickLemonRobotics then
            Threads.LemonRobotics = task.spawn(function()
                while _G_AutoClickLemonRobotics do
                    ClickIncomeStream("LemonRobotics")
                    task.wait(0.05)
                end
            end)
        end
    end
})

ClickTab:CreateToggle({
    Name = "Auto click cộng hòa",
    CurrentValue = false,
    Flag = "ToggleClickLemonRepublic",
    Callback = function(Value)
        _G_AutoClickLemonRepublic = Value
        if Threads.LemonRepublic then
            task.cancel(Threads.LemonRepublic)
            Threads.LemonRepublic = nil
        end

        if _G_AutoClickLemonRepublic then
            Threads.LemonRepublic = task.spawn(function()
                while _G_AutoClickLemonRepublic do
                    ClickIncomeStream("LemonRepublic")
                    task.wait(0.05)
                end
            end)
        end
    end
})

ClickTab:CreateToggle({
    Name = "tự động click lemonX",
    CurrentValue = false,
    Flag = "ToggleClickLemonX",
    Callback = function(Value)
        _G_AutoClickLemonX = Value
        if Threads.LemonX then
            task.cancel(Threads.LemonX)
            Threads.LemonX = nil
        end

        if _G_AutoClickLemonX then
            Threads.LemonX = task.spawn(function()
                while _G_AutoClickLemonX do
                    ClickIncomeStream("LemonX")
                    task.wait(0.05)
                end
            end)
        end
    end
})

ClickTab:CreateToggle({
    Name = "Auto Click LemonTrading",
    CurrentValue = false,
    Flag = "ToggleClickLemonTrading",
    Callback = function(Value)
        _G_AutoClickLemonTrading = Value
        if Threads.LemonTrading then
            task.cancel(Threads.LemonTrading)
            Threads.LemonTrading = nil
        end

        if _G_AutoClickLemonTrading then
            Threads.LemonTrading = task.spawn(function()
                while _G_AutoClickLemonTrading do
                    ClickIncomeStream("LemonTrading")
                    task.wait(0.05)
                end
            end)
        end
    end
})

-- ============================
-- TAB PET
-- ============================
local PetTab = Window:CreateTab("Pet", 4483362458)

PetTab:CreateParagraph({
    Title = "⚠️ LƯU Ý",
    Content = "Bạn cần phải hoàn thành nhiệm vụ mới lấy được do tab pet đang sửa chữa"
})

PetTab:CreateButton({
    Name = "Lấy pet slime",
    Callback = function()
        ClaimSlimePet()
    end,
})

-- ============================
-- TAB PHẢN HỒI (FEEDBACK & TOOLS)
-- ============================
local FeedbackTab = Window:CreateTab("Phản hồi", 4483362458)

FeedbackTab:CreateParagraph({
    Title = "🛡️ TÍNH NĂNG HỖ TRỢ HỆ THỐNG",
    Content = "Các công cụ chuyển server, chống AFK, vào lại server và tối ưu giảm Lag."
})

FeedbackTab:CreateButton({
    Name = "hop sever ít người",
    Callback = function()
        HopServer("Low")
    end,
})

FeedbackTab:CreateButton({
    Name = "hop 1 sever ngẫu nhiên",
    Callback = function()
        HopServer("Random")
    end,
})

FeedbackTab:CreateButton({
    Name = "hop sever đông người",
    Callback = function()
        HopServer("High")
    end,
})

FeedbackTab:CreateButton({
    Name = "🔄 Vào lại server hiện tại",
    Callback = function()
        Rayfield:Notify({Title = "🚀 Đang chuyển server", Content = "Đang kết nối lại server hiện tại...", Duration = 3})
        pcall(function()
            if #Players:GetPlayers() <= 1 then
                TeleportService:Teleport(game.PlaceId, Player)
            else
                TeleportService:TeleportToPlaceInstance(game.PlaceId, game.JobId, Player)
            end
        end)
    end,
})

FeedbackTab:CreateToggle({
    Name = "Anti AFK (Tránh bị kick 20p)",
    CurrentValue = false,
    Flag = "ToggleAntiAFK",
    Callback = function(Value)
        _G_AntiAFK = Value
        if Threads.AntiAFK then
            task.cancel(Threads.AntiAFK)
            Threads.AntiAFK = nil
        end

        if _G_AntiAFK then
            Rayfield:Notify({Title = "🛡️ Anti AFK", Content = "Đã BẬT chống treo máy 20 phút!", Duration = 3})
            Threads.AntiAFK = task.spawn(function()
                while _G_AntiAFK do
                    pcall(function()
                        VirtualInputManager:SendKeyEvent(true, Enum.KeyCode.Unknown, false, game)
                        task.wait(0.1)
                        VirtualInputManager:SendKeyEvent(false, Enum.KeyCode.Unknown, false, game)
                    end)
                    task.wait(60)
                end
            end)
        else
            Rayfield:Notify({Title = "⏹️ Anti AFK", Content = "Đã TẮT Anti AFK!", Duration = 2})
        end
    end
})

FeedbackTab:CreateButton({
    Name = "Bật Anti Kick (Auto Rejoin)",
    Callback = function()
        pcall(function()
            GuiService.ErrorMessageChanged:Connect(function()
                task.wait(1)
                if #Players:GetPlayers() <= 1 then
                    TeleportService:Teleport(game.PlaceId, Player)
                else
                    TeleportService:TeleportToPlaceInstance(game.PlaceId, game.JobId, Player)
                end
            end)
        end)
        Rayfield:Notify({Title = "🔄 Anti Kick", Content = "Đã bật tự động vào lại khi bị kick / mất kết nối!", Duration = 3})
    end,
})

FeedbackTab:CreateButton({
    Name = "Anti Lag (Tối ưu hóa game)",
    Callback = function()
        pcall(function()
            Lighting.GlobalShadows = false
            Lighting.FogEnd = 9e9
            
            for _, v in pairs(Workspace:GetDescendants()) do
                if v:IsA("ParticleEmitter") or v:IsA("Trail") or v:IsA("Smoke") or v:IsA("Fire") or v:IsA("Sparkles") then
                    v.Enabled = false
                elseif v:IsA("PostEffect") then
                    v.Enabled = false
                end
            end
            
            settings().Rendering.QualityLevel = 1
        end)
        Rayfield:Notify({Title = "⚡ Anti Lag", Content = "Đã dọn dẹp hiệu ứng & giảm lag thành công!", Duration = 3})
    end,
})

FeedbackTab:CreateParagraph({
    Title = "⚠️ QUY ĐỊNH PHẢN HỒI",
    Content = "Tất cả phản hồi sẽ gửi thông tin Tên & ID Roblox của bạn đến Admin."
})

FeedbackTab:CreateInput({
    Name = "Nội dung phản hồi",
    PlaceholderText = "Nhập góp ý, báo lỗi hoặc phản hồi tại đây...",
    RemoveTextOnFocus = false,
    Callback = function(Text)
        FeedbackText = Text
    end,
})

FeedbackTab:CreateButton({
    Name = "Gửi phản hồi",
    Callback = function()
        if FeedbackText == "" or #FeedbackText:gsub("%s+", "") == 0 then
            Rayfield:Notify({Title = "⚠️ Cảnh báo", Content = "Vui lòng nhập nội dung trước khi gửi!", Duration = 3})
            return
        end

        local success = SendWebhook(FeedbackText)
        if success then
            Rayfield:Notify({Title = "✅ Thành công", Content = "Phản hồi của bạn đã được gửi đến Admin!", Duration = 3})
        else
            Rayfield:Notify({Title = "❌ Thất bại", Content = "Không thể gửi phản hồi. Vui lòng thử lại sau!", Duration = 3})
        end
    end,
})

Rayfield:Notify({Title = "🍋", Content = "🍋menu bán chanh🍋 v3.5 vip đã sẵn sàng!", Duration = 3})
